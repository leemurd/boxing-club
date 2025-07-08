// File: src/infrastructure/data/FirestoreRepository.ts
import {
  Firestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  DocumentSnapshot,
  DocumentReference
} from 'firebase/firestore'

/**
 * Абстрактный класс для общих CRUD-операций в Firestore.
 * @template Entity — доменная сущность
 * @template PlainIn — форма входных данных для create
 * @template PlainOut — форма данных для записи и update (должна содержать поле id? для update)
 */
export abstract class FirestoreRepository<Entity, PlainIn, PlainOut extends { id?: string } = Partial<Entity> & { id?: string }> {
  constructor(
    protected readonly db: Firestore,
    private readonly root: string
  ) {}

  protected col(userId: string) {
    return collection(this.db, 'users', userId, this.root)
  }

  /**
   * Преобразование документа Firestore в доменную сущность.
   */
  protected abstract toEntity(snap: DocumentSnapshot): Entity

  /**
   * Преобразование входных или обновлённых данных в формат для записи.
   */
  protected abstract toPlainOut(data: PlainIn | PlainOut): PlainOut

  async getAll(userId: string): Promise<Entity[]> {
    const snap = await getDocs(this.col(userId))
    return snap.docs.map((d) => this.toEntity(d))
  }

  async getById(userId: string, id: string): Promise<Entity | null> {
    const ref = doc(this.col(userId), id)
    const snap = await getDoc(ref)
    return snap.exists() ? this.toEntity(snap) : null
  }

  /**
   * Принимает данные PlainIn, возвращает Entity.
   */
  async create(userId: string, data: PlainIn): Promise<Entity> {
    const plain = this.toPlainOut(data)
    let ref: DocumentReference

    if (plain.id) {
      ref = doc(this.col(userId), plain.id)
      await setDoc(ref, plain)
    } else {
      ref = await addDoc(this.col(userId), plain)
    }

    const createdSnap = await getDoc(ref)
    return this.toEntity(createdSnap)
  }

  /**
   * PlainOut должен содержать обязательное поле id.
   */
  async update(userId: string, data: PlainOut & { id: string }): Promise<void> {
    const plain = this.toPlainOut(data)
    const ref = doc(this.col(userId), plain.id)
    await updateDoc(ref, plain)
  }

  async delete(userId: string, id: string): Promise<void> {
    const ref = doc(this.col(userId), id)
    await deleteDoc(ref)
  }
}
