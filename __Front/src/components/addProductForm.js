import { useState } from "react";

const AddProductForm = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [price, setPrice] = useState('');
	const [error, setError] = useState(null);

	const createNew = async (e) => {
		e.preventDefault();

		const product = { title, description, category, price };

		const productToAdd = await fetch('/api/products', {
			method: 'POST',
			body: JSON.stringify(product),
			headers: {
				'Content-Type': 'application/json'
			}
		})

		const newProduct = await productToAdd.json();

		if (!productToAdd.ok) {
			setError(newProduct.error)
		}

		if (productToAdd.ok) {
			setTitle('');
			setDescription('');
			setCategory('');
			setPrice('');
			setError(null);

			console.log(productToAdd, 'success!')
		}
	}

	return (
		<form className="create" onSubmit={createNew}>
			<h3>Add new product</h3>

			<label>Naziv:</label>
			<input type="text" onChange={(e) => setTitle(e.target.value)} value={title} />

			<label>Opis:</label>
			<input type="text" onChange={(e) => setDescription(e.target.value)} value={description} />

			<label>Kategorija proizvoda:</label>
			<input type="text" onChange={(e) => setCategory(e.target.value)} value={category} />

			<label>Cena:</label>
			<input type="number" onChange={(e) => setPrice(e.target.value)} value={price} />

			<button>Dodaj proizvod</button>

			{error && <div className="error">{error}</div>}
		</form>

	);
}

export default AddProductForm;