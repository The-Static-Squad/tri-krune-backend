
const ProductItem = (props) => {
	return (
		<div className="product-details">
			<h4>{props.product.name}</h4>
			<p>Opis: {props.product.description}</p>
			<p>Kategorija: {props.product.category}</p>
			<p>Cena: {props.product.price}</p>
			<p>Dodato: {props.product.createdAt}</p>
		</div>
	);
}

export default ProductItem;