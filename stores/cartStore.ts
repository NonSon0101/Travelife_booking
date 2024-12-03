import { makeAutoObservable } from 'mobx'
import RootStore from 'stores'
import { addToCart, deleteCard, getListCart, updateCart } from 'API/cart'
import {
  IAddToCart,
  IDeleteCart,
  IListCart,
  IUpdateToCart,
} from 'interfaces/cart'
import { ISelectedCart } from 'interfaces/checkout'

class CartStrores {
  constructor(rootStore: RootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    this.selectedCart = []
    this.currentCurrency = ''
  }

  rootStore: RootStore
  listCart = {} as IListCart
  cartCount: number = 0
  selectedCart: ISelectedCart[]
  currentCurrency: string

  setSelectedCart(data: ISelectedCart): void {
    this.selectedCart.push(data)
  }

  unSetSelectedCart(tour: string): void {
    this.selectedCart = this.selectedCart.filter((item) => item?.tour !== tour)
  }

  async fetchCartCount(): Promise<void> {
    const { cart } = await getListCart()
    this.cartCount = cart?.tours?.length
    this.listCart = cart
  }

  async addToCart(data: IAddToCart): Promise<void> {
    const { cart } = await addToCart(data)
    this.listCart = cart
  }

  async getListCart(): Promise<void> {
    const { cart } = await getListCart()
    this.listCart = cart
    if (cart) {
      this.currentCurrency = cart.tours[0].participants[0].currency ?? '';
    }
  }

  async updateCart(data: IUpdateToCart): Promise<void> {
    const { updatedCart } = await updateCart(data)
    this.listCart = updatedCart
  }

  async deleteCart(data: IDeleteCart): Promise<void> {
    const { cart } = await deleteCard(data)
    this.listCart = cart
  }
}

export default CartStrores
