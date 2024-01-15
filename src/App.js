import { useEffect, useState } from "react";
import "./App.css";
import { getAllPokemon, getPokemon } from "./utils/pokemon";
import Card from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState([]);
  const [prevURL, setPrevURL] = useState([]);
  //自作変数
  const [nowPageNumber, setNowPage] = useState(0);
  const [pushPageNumber, setPushPage] = useState(0);
  const [firstskip, setFirstSkip] = useState(false);
  const [endPage,setEndPage] = useState(0);

  //useEffectの第2引数が[]で一度だけの処理を表すみたい
  useEffect(() => {
    //非同期処理はasync関数を使うらしい0
    const fectPokemonData = async () => {
      //全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);
      //各ポケモンの詳細なデータを取得
      loadPokemon(res.results);
      // console.log(res.results[0]); //ふしぎだねの配列
      // console.log("次のＵＲＬ"+res.next);
      // console.log("前のＵＲＬ"+res.previous);
      setPrevURL(res.previous);
      setNextURL(res.next);
      setLoading(false);
      setNowPage(1);
      const endPage= Math.ceil(res.count/20);
      setEndPage(endPage);
    };
    fectPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    //_pokemonDataには新規配列のurlが入る？
    let _pokemonData = await Promise.all(
      //map関数でpokemon1体ずつのurlの配列作成
      data.map((pokemon) => {
        // console.log(pokemon);
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    // console.log(data);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setLoading(false);
    setPrevURL(data.previous);
    setNowPage(nowPageNumber + 1);
  };

  const handlePrevPage = async () => {
    if (!prevURL) return;

    setLoading(true);
    let data = await getAllPokemon(prevURL);
    // console.log(data);
    await loadPokemon(data.results);
    setPrevURL(data.previous);
    setLoading(false);
    setNextURL(data.next);
    setNowPage(nowPageNumber - 1);
  };
  //じさく
  const handleNumberPage = async (number) => {
    await setPushPage(number);
  };

  //数字ボタン押した時
  useEffect(() => {
    getPokemonPageNumber(pushPageNumber);
    //↓警告消すコメント。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushPageNumber]);

  //1～4ページボタン入力時にそのURL取得
  const getPokemonPageNumber = async (number) => {
    if (!firstskip) {
      setFirstSkip(true);
      return;
    }

    const numberDiff = number - 1;
    const offsetNumber = numberDiff * 20;
    const offsetURL = `https://pokeapi.co/api/v2/pokemon?offset=${offsetNumber}&limit=20`;
    console.log("オフセットURL" + offsetURL);

    setLoading(true);
    let data = await getAllPokemon(offsetURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setLoading(false);
    setPrevURL(data.previous);
    setNowPage(number);
  };
  //Noボタン生成コード
  const generateNumberBuutons = () => {
    const nowNumber = nowPageNumber + 1;
    const buttonsToshow = 3;
    const generateButtons = [];
    for (let i = nowNumber; i < nowNumber + buttonsToshow; i++) {
      generateButtons.push(
        <button key={i} onClick={() => handleNumberPage(i)}>
          {i}
        </button>
      );
    }
    return generateButtons;
  };

  //'.....'の生成,１ページ側
  const generateEllipsisStart = () => {
    if (nowPageNumber !== 1) {
      return <span key="ellipsisStart">{"....."}</span>;
    }
  };

 //'.....'の生成,エンド側
const generateEllipsisEnd = () =>{
if(nowPageNumber !== endPage){
  return <span key="ellipsisEnd">{"....."}</span>;
}
};
//エンドページボタン
const generateEndNumberBuuton =()=>{
  console.log(endPage);
  return <button key="endBuuton" onClick={() => handleNumberPage(endPage)}>{endPage}</button>;
};

  return (
    <>
      <Navbar />
      <div className="pageNumber">
        <p>{nowPageNumber}ページ目</p>
      </div>
      <div className="btn">
        <button onClick={handlePrevPage}>前へ</button>
        <button onClick={handleNextPage}>次へ</button>
      </div>
      <div className="App">
        {/* 三項演算子でロード中orポケモンデータ取得切替 */}
        {loading ? (
          <h1>ロード中・・・</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                // CardはReactコンポーネントらしい
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="pageNumber">
              <p>{nowPageNumber}ページ目</p>
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
            <div className="btnNumber">
              <button onClick={() => handleNumberPage(1)}>1</button>
              <span>{generateEllipsisStart()}</span>  {/* 1ページ以外の時'.....'表示 */}
              {generateNumberBuutons()} {/* ボタン生成、３ページ分表示 */}
              {generateEllipsisEnd()} {/* 最終ページ以外の時'.....'表示 */}
              {generateEndNumberBuuton()}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
