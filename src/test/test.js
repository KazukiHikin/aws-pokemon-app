//fecth関数は外部からデータをもらうための関数
//処理が順番に進んでいって後続の処理を待つ
// //非同期処理

fetch("test.txt")
  .then((res) => res.text())
  .then((data) => console.log(data));

// const a = 1;
// const b = 2;
// const c = 3;
// console.log(a + 2 + b + c);

// //もう一つ別の書き方がある
// async function fectchData() {
//   const data = await fetch("test.txt");
//   const res = await data.text();
//   console.log(res);
// }
// fectchData();

// fetch("data.json")
//   .then((data) => data.json())
//   .then((res) => console.log(res));

// fetch("./image.jpg")
//   .then((data) => data.blob())
//   .then((res) => {
//     const image = new Image();
//     document.body.appendChild(image);
//     image.src= URL.createObjectURL(res);
//     console.log(image);
//   });
