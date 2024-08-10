const STORAGE_KEY = '@liferay-ai-content-wizard/swr';

/**
 * @description When initializing, we restore the data from `STORAGE` into a map.
 * Before unloading the app, we write back all the data into `STORAGE`.
 * We still use the map for write & read for performance.
 */

const SWRCacheProvider = (): Map<any, any> => {
    const cacheMap = new Map(
        JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    );

    window.addEventListener('beforeunload', () => {
        const appCache = JSON.stringify(Array.from(cacheMap.entries()));

        localStorage.setItem(STORAGE_KEY, appCache);
    });

    return cacheMap;
};

export default SWRCacheProvider;
