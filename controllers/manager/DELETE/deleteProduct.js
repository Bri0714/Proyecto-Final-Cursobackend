import productManager from "../../../dao/manager/products.manager.js";
import logger from "../../../utils/logger.js";

// Controlador para eliminar un producto
export const deleteProduct = async (req, res) => {
  const { productId } = req.body;
  const user = req.user;

  try {
    // Intentamos obtener el producto que se va a eliminar
    const product = await productManager.deleteProduct(productId);

    // Si el producto no se encuentra, respondemos con un estado 404
    if (!product) {
      return res.status(404).json({ err: "Producto no encontrado" });
    }

    // Si el usuario es un administrador o el propietario del producto, procedemos con la eliminación
    if (user.role === "admin" || product.owner === user.email) {
      // Eliminamos el producto de la base de datos
      await productManager.deleteProduct(productId);

      // Registramos un mensaje informativo
      logger.info(`Producto ${productId} eliminado`);

      // Redirigimos al usuario de vuelta a la página de productos
      return res.redirect("/api/products");
    } else {
      // Si el usuario no tiene permiso para eliminar el producto, registramos un mensaje de advertencia
      logger.warning(
        `Permiso denegado para eliminar el producto. ${user.email} no es el propietario del producto (${productId})`
      );

      // Respondemos con un estado 403 (Prohibido) y renderizamos una página de error
      return res.status(403).render("errors/owner-denied");
    }
  } catch (err) {
    // Manejo de errores en caso de problemas al eliminar el producto de la base de datos
    logger.error(`
      Se produjo un error al eliminar el producto de la base de datos.
      ${err.stack}  
    `);
    res.status(500).json({
      err: "Se produjo un error al eliminar el producto de la base de datos.",
    });
  }
};