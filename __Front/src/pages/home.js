import { useEffect, useState } from "react";

import ProductItem from "../components/productItem";
import AddProductForm from "../components/addProductForm";

const Home = () => {

	const [products, setProducts] = useState(null);

	useEffect(() => {
		const getProducts = async () => {
			const respData = await fetch('/api/v1/products');
			const jsonData = await respData.json();

			if (respData.ok) {
				setProducts(jsonData);
			}
		}

		getProducts();

	}, [])

	return (
		<div className="home">
			<div className="products">
				{products && products.map((item)=> (
					<ProductItem key={item._id} product={item}/>
				))}
			</div>
			<AddProductForm/>
		</div>
	);
}

export default Home;