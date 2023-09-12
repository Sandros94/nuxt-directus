import type {
  DirectusItemRequestOptions,
  RegularCollections,
  SingletonCollections
} from '../types'
import { useAsyncData, readItem, readItems } from '#imports'

export function useDirectusItems<TSchema extends object> () {
  const directus = useDirectusRest<TSchema>()

  /**
   * Get a single item from a collection.
   * @param collection The collection name to get the item from.
   * @param id The id of the item to get.
   * @param options The options to use when fetching the item.
   */
  const getItemById = async (
    collection: RegularCollections<TSchema>,
    id: string | number,
    options?: DirectusItemRequestOptions
  ) => {
    const { data, pending, refresh, execute, error, status } = await useAsyncData(
      // TODO: add logic to randomize key if query is present
      options?.key ?? `${String(collection)}_${id}`,
      async () => {
        // TODO: if/else untill https://github.com/directus/directus/issues/19621 is fixed
        if (!id) { throw new Error('You must provide an id to get an item with getItemById.') }
        else {
          return await directus.request(readItem(collection, id, options?.query))
        }
      }, options?.params
    )
    return { data, pending, refresh, execute, error, status }
  }

  /**
   * Get all the items from a collection.
   * @param collection The collection name to get the items from.
   * @param options The options to use when fetching the items.
   */
  const getItems = async (
    collection: RegularCollections<TSchema>,
    options?: DirectusItemRequestOptions
  ) => {
    const { data, pending, refresh, execute, error, status } = await useAsyncData(
      // TODO: add logic to randomize key if query is present
      options?.key ?? String(collection),
      async () => await directus.request(readItems(collection, options?.query)), options?.params
    )
    return { data, pending, refresh, execute, error, status }
  }
  /**
   * Get the item from a collection marked as Singleton.
   * @param collection The collection name to get the items from.
   * @param options The options to use when fetching the items.
   */
  const getSingletonItem = async (
    collection: SingletonCollections<TSchema>,
    options?: DirectusItemRequestOptions
  ) => {
    const { data, pending, refresh, execute, error, status } = await useAsyncData(
      // TODO: add logic to randomize key if query is present
      options?.key ?? String(collection),
      async () => await directus.request(readSingleton(collection, options?.query)), options?.params
    )
    return { data, pending, refresh, execute, error, status }
  }

  return {
    getItemById,
    getItems,
    getSingletonItem
  }
}
