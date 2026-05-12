/**
 * Helper para estandarizar la paginación en toda la API
 */
const getPagination = (page, size) => {
    const limit = size ? +size : 10; // Por defecto 10 registros
    const offset = page ? (page - 1) * limit : 0; // Calculamos el salto

    return { limit, offset };
};

/**
 * Helper para formatear la respuesta con metadatos de paginación
 */
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, items, totalPages, currentPage };
};

module.exports = { getPagination, getPagingData };
