import { productModel } from "../db";

class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  // 카테고리 별 상품 목록 조회
  async getProductsByCategory(category) {
    //TODO: category가 존재하는지 확인
    //const category = await this.categoryModel.findByCategoryType(category)
    //if(!category){return `${category}는 존재하지 않는 카테고리입니다.`}

    // category로 검색
    const products = await this.productModel.findByCategory(category);
    //category 안에 존재하지 않을 때
    if (products.length < 1) {
      return `${category}은(는) 상품 준비중입니다😥`;
    }

    return products;
  }

  //상품 추가
  async addProduct(productInfo) {
    const productName = productInfo.productName;

    //productName 중복 확인
    const product = await this.productModel.findByProductName(productName);
    if (product) {
      throw new Error(
        `${productName}은 이미 존재하는 이름입니다. 다른 이름을 입력하세요.`
      );
    }

    // db에 저장
    const createdNewProduct = await this.productModel.create(productInfo);
    return createdNewProduct;
  }

  // 상품 수정
  async setProduct({ productInfoRequired, toUpdate }) {
    // 현재 productName
    const productName = productInfoRequired.productName;

    // 해당 상품이 존재하는지 확인
    let product = await this.productModel.findByProductName(productName);

    if (!product) {
      throw new Error("존재하지 않는 상품입니다. 다시 한 번 확인해주세요.");
    }
    
    // 수정
    const updatedProduct = await this.productModel.update({
      productInfoRequired,
      toUpdate,
    });

    return updatedProduct;
  }

  async deleteProduct(productName) {
    // 해당 상품이 존재하는지 확인
    let product = await this.productModel.findByProductName(productName);
    if (!product) {
      throw new Error("존재하지 않는 상품입니다. 다시 한 번 확인해주세요.");
    }

    // 삭제
    const deletedResult = await this.productModel.deleteProduct(productName);
    return deletedResult;
  }
}

const productService = new ProductService(productModel);

export { productService };
