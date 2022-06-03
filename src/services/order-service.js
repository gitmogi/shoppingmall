import { orderModel } from "../db";

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  //사용자 주문 정보 조회하기
  async getOrdersByUserId(userId) {
    //phoneNumber가 있는지 조회
    const orders = await this.orderModel.findByUserId(userId);
    //phoneNumber가 존재하지 않을 때
    if (!orders) {
      return `주문 정보가 없습니다.`;
    }

    return orders;
  }

  //주문 정보 db에 저장하기
  async addOrder(orderInfo) {
    // db에 저장
    const createdNewOrder = await this.orderModel.create(orderInfo);

    return createdNewOrder;
  }

  //주문 정보 삭제
  async deleteOrder(orderId) {
    // 주문 정보 유무 확인
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new Error("해당 주문은 존재하지 않습니다.");
    }

    // 주문 정보 유무를 확인 했으니 주문 정보 삭제를 진행함
    // db에 반영
    const deletedResult = await this.orderModel.deleteOrder(orderId);

    return deletedResult;
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
