import { useState } from 'react';

const initialFriends = [
	{
		id: 12345,
		name: 'John',
		image: 'https://i.pravatar.cc/48?u=118836',
		balance: -7,
	},
	{
		id: 23456,
		name: 'Sarah',
		image: 'https://i.pravatar.cc/48?u=933372',
		balance: 0,
	},
	{
		id: 34567,
		name: 'Tom',
		image: 'https://i.pravatar.cc/48?u=499476',
		balance: 15,
	},
];

export default function App() {
	const [friends, setFriends] = useState(initialFriends);
	const [showForm, setShowForm] = useState(false);

	console.log(friends);

	function toggleFormFriend() {
		setShowForm((show) => !show);
	}

	function handleAddFriend(newFriend) {
		// We need to create a new array to make sure React Re-Renders Component
		// so we will use spread the current array and add the new one
		// instead of a .push() method which would mutate the Array instead of create a new one
		setFriends((friends) => [...friends, newFriend]);
	}

	return (
		<div className='app'>
			<div className='sidebar'>
				{showForm && <FormFriend onAddFriend={handleAddFriend}></FormFriend>}
			</div>
			<button onClick={toggleFormFriend}>Toggle</button>
		</div>
	);
}

function FormFriend({ onAddFriend }) {
	const [name, setName] = useState('');
	const [image, setImage] = useState('https://i.pravatar.cc/48');

	function handleSubmit(event) {
		event.preventDefault();
		const friend = {
			id: Date.now(),
			name: name,
			image: image,
			balance: 0,
		};

		onAddFriend(friend);
	}

	return (
		<form
			className='form-add-friend'
			onSubmit={handleSubmit}>
			<label>Name : </label>
			<input
				type='text'
				placeholder="enter Friend's Name"
				onChange={(e) => setName(e.target.value)}></input>
			<label>Image : </label>
			<input
				type='text'
				placeholder="enter Friend's Image URL"
				onChange={(e) => setImage(e.target.value)}></input>
			<button>Submit</button>
		</form>
	);
}
