import * as Api from "/api.js";
import { changeNavbar } from "/changeNavbar.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

changeNavbar();

const optionStatus = {
  "Information Received": "주문완료",
  Processing: "상품준비중",
  "Out of Delivery": "배송준비중",
  "In transit": "배송중",
  Delivered: "배송완료",
};

renderDataFromApi();

function handleAllEvent() {
  $$(".deleteButton").forEach((btn) => btn.addEventListener("click", cancelOrder));
  $$(".statusMessage").forEach((select) => select.addEventListener("change", changeDataFromApi));
}

// 데이터 받아서 출력하기
async function renderDataFromApi() {
  const data = await Api.get("/api/order/list");
  let userStatus = "";

  // 배송상태 확인
  data.forEach((el) => {
    let productList = "";
    const nowStatus = el.status;
    userStatus = optionStatus[nowStatus];

    el.products.forEach((data) => {
      productList += " " + data.productName;
    });

    $("#orderlistContainer").innerHTML += `<div class="orderItem">
    <span>${el.fullName}</span>
    <span>${el.createdAt.substr(0, 10)}</span>
    <span>${productList}</span>
    <span>
      <select class="statusMessage" id="requestInput">
      
        <option ${
          userStatus === '주문완료' && 'selected'
        }>주문완료</option>
        <option ${
          userStatus === '상품준비중' && 'selected'
        }>상품준비중</option>
        <option ${
          userStatus === '배송준비중' && 'selected'
        }>배송준비중</option>
        <option ${
          userStatus === '배송중' && 'selected'
        }>배송중</option>
        <option ${
          userStatus === '배송완료' && 'selected'
        }>배송완료</option>
      </select>
    </span>
    <button class="deleteButton">X</button>
    <span class="id">${el._id}</span>
  </div>`;
  });

  handleAllEvent();
}

async function cancelOrder(e) {
  let target = e.target;
  console.log(target.parentNode.children[5].innerHTML);
  const orderId = target.parentNode.children[5].innerHTML;
  await Api.delete("/api/order/" + orderId);
  target.parentNode.remove();
  alert("주문이 취소되었습니다.");
}

async function changeDataFromApi(e) {
  let target = e.target;
  const changeStatus = target.value;
  const orderId = target.parentNode.parentNode.querySelector(".id").innerHTML;
  const status = Object.keys(optionStatus).find((key) => optionStatus[key] === changeStatus);

  await Api.patch("/api/order", orderId, { status });
  alert("주문상태가 변경 되었습니다.");
}
