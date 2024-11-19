// 取得input欄位DOM
const ticketName = document.querySelector("#ticketName");
const ticketImgUrl = document.querySelector("#ticketImgUrl");
const ticketRegion = document.querySelector("#ticketRegion");
const ticketPrice = document.querySelector("#ticketPrice");
const ticketNum = document.querySelector("#ticketNum");
const ticketRate = document.querySelector("#ticketRate");
const ticketDescription = document.querySelector("#ticketDescription");
const addBtn = document.querySelector(".addTicket-btn");
const list = document.querySelector(".ticketCard-area");

// 取得資料筆數DOM
let resultNum = document.querySelector("#resultNum");

// 初始化渲染
function renderData(array) {
  let str = "";
  array.forEach((item) => {
    str += `<li class="ticketCard">
<div class="ticketCard-img">
  <a href="#">
    <img
      src="${item.imgUrl}"
      alt=""
    />
  </a>
  <div class="ticketCard-region">${item.area}</div>
  <div class="ticketCard-rank">${item.rate}</div>
</div>
<div class="ticketCard-content">
  <div>
    <h3>
      <a href="#" class="ticketCard-name">${item.name}</a>
    </h3>
    <p class="ticketCard-description">
      ${item.description}
    </p>
  </div>
  <div class="ticketCard-info">
    <p class="ticketCard-num">
      <span><i class="fas fa-exclamation-circle"></i></span>
      剩下最後 <span id="ticketCard-num">${item.group}</span> 組
    </p>
    <p class="ticketCard-price">
      TWD <span id="ticketCard-price">${item.price}</span>
    </p>
  </div>
</div>
</li>`;
  });
  list.innerHTML = str;

  // 更新資料筆數
  resultNum.innerHTML = array.length;

  // 圖表初始化載入
  renderChart(data);
}

// 新增套票
addBtn.addEventListener("click", addData);
function addData() {
  // 套票資料格式
  const newTicket = {
    id: data.length - 1,
    name: ticketName.value,
    imgUrl: ticketImgUrl.value,
    area: ticketRegion.value,
    description: ticketDescription.value,
    group: Number(ticketNum.value),
    price: Number(ticketPrice.value),
    rate: Number(ticketRate.value),
  };
  // 新增資料至 data陣列
  data.push(newTicket);
  regionFilter();
  ticketName.value = "";
  ticketImgUrl.value = "";
  ticketRegion.value = "";
  ticketDescription.value = "";
  ticketNum.value = "";
  ticketPrice.value = "";
  ticketRate.value = "";
}

// 地區篩選
addEventListener("change", regionFilter);
function regionFilter() {
  const filterList = document.querySelector(".regionSearch");
  const filterArea = filterList.value;
  let filteredData = data.filter((item) => {
    // 預設value地區搜尋、全部地區，都是顯示全部資料
    if (filterArea === "全部地區" || filterArea === "地區搜尋") {
      return data;
    } else if (filterArea === item.area) {
      return item.area === filterArea;
      // 比對選單地區及資料地區，回傳完全相符的資料
    }
  });
  // 渲染篩選過後的資料
  renderData(filteredData);

  // 更新篩選後的資料筆數
  updateAndRender(filteredData);
}

// 更新資料筆數
function updateAndRender(array) {
  renderData(array);
  resultNum.innerHTML = array.length;
  // 用 array data 更新圖表data
  renderChart(array);
}

// 圖表
// 載入初始data
// 資料型式
// initAreaData = [
//  ["台北", 1],
//  ["台中", 1],
//  ["高雄", 1],
// ]
function renderChart(data) {
  const areaCount = {};
  data.forEach((item) => {
    return (areaCount[item.area] = (areaCount[item.area] || 0) + 1);
  });
  // console.log("areaCount", areaCount);
  const newArr = Object.keys(areaCount);
  // console.log("newArr", newArr);

  const areaCountData = []; // [["台北", 1]]
  newArr.forEach((item) => {
    let arr = [];
    arr.push(item); // 台北
    arr.push(areaCount[item]); // 1
    areaCountData.push(arr); // ["台北", 1]
  });
  // console.log("areaCountData", areaCountData);

  var chart = c3.generate({
    data: {
      columns: areaCountData,
      type: "donut",
      onclick: function (d, i) {},
      onmouseover: function (d, i) {},
      onmouseout: function (d, i) {},
    },
    donut: {
      title: "套票地區比重",
      width: 12,
      label: {
        show: false,
      },
    },
    size: {
      width: 200,
      height: 200,
    },
  });
}

axios
  .get(
    "https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json"
  )
  .then(function (response) {
    data = response.data;
    // 頁面載入時執行初始化渲染
    renderData(data);

    // 渲染圖表
    renderChart(data);
  });
