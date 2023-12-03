import { useState } from 'react';

const initialFriends = [
	{
		id: 118836,
		name: 'Clark',
		image: 'https://i.pravatar.cc/48?u=118836',
		balance: -7,
	},
	{
		id: 933372,
		name: 'Sarah',
		image: 'https://i.pravatar.cc/48?u=933372',
		balance: 20,
	},
	{
		id: 499476,
		name: 'Anthony',
		image: 'https://i.pravatar.cc/48?u=499476',
		balance: 0,
	},
];

export default function App() {
	const [friends, setFriends] = useState(initialFriends);
	const [showFormAddFriend, setShowFormAddFriend] = useState(false);
	console.log(friends);
	function ToggleShowAddFriend() {
		setShowFormAddFriend((show) => !show);
	}

	function handleNewFriend(newFriend) {
		setFriends((friends) => [...friends, newFriend]);
		setShowFormAddFriend(false);
	}

	return (
		<div className='app'>
			<div className='sidebar'>
				<FriendsList friends={friends} />
				{showFormAddFriend && <FormAddFriend onAddFriend={handleNewFriend} />}
				<Button
					className={'button'}
					onToggleFormAddFriend={() => ToggleShowAddFriend()}>
					{showFormAddFriend ? 'Close' : 'Add a Friend'}
				</Button>
			</div>
			<div>
				<FormSplitBill friends={friends} />
			</div>
		</div>
	);
}
function FriendsList({ friends }) {
	// const friends = initialFriends;

	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					friend={friend}
					key={friend.id}
				/>
			))}
		</ul>
	);
}

function Friend({ friend }) {
	return (
		<li>
			<img
				src={friend.image}
				alt={friend.name}></img>
			<h3>{friend.name}</h3>
			{friend.balance < 0 && (
				<p className='red'>
					You owe {friend.name} ${Math.abs(friend.balance)}
				</p>
			)}
			{friend.balance > 0 && (
				<p className='green'>
					{friend.name} owes you ${friend.balance}
				</p>
			)}
			{friend.balance === 0 && <p className=''>You and your Friend {friend.name} are even!</p>}
			<Button className='button'>Select</Button>
		</li>
	);
}
function Button({ className, onToggleFormAddFriend, children }) {
	return (
		<button
			className={className ? className : ''}
			onClick={onToggleFormAddFriend}>
			{children}
		</button>
	);
	// Same as...
	//return <button className={className || ""}>{children}</button>;
}

function FormAddFriend({ onAddFriend }) {
	const [name, setName] = useState('');
	const [image, setImage] = useState('https://i.pravatar.cc/48');

	/**
	 * Submits the form, creates a new friend, and resets the form fields.
	 * @param {object} event - The event object from the form submission.
	 */
	const handleSubmit = (event) => {
		event.preventDefault();
		if (!name) return;

		const id = crypto.randomUUID();

		const newFriend = { name: name, image: `${image}?=${id}`, id: id, balance: 0 };
		/**
		 * Lifting up state to App.js through function passed by App.js
		 */
		// console.log('newFriend', newFriend);
		onAddFriend(newFriend);

		// Reset Fields (states) values
		setName('');
		setImage('https://i.pravatar.cc/48');
	};

	return (
		<form
			className='form-add-friend'
			onSubmit={handleSubmit}>
			<label>Friend Name: </label>
			<input
				type='text'
				placeholder="Enter Friend's name"
				value={name}
				onChange={(e) => setName(e.target.value)}></input>

			<label>Image URL: </label>
			<input
				type='text'
				placeholder="Enter Friend's Image URL"
				value={image}
				onChange={(e) => setImage(e.target.value)}></input>
			<Button className='button'>Add</Button>
		</form>
	);
}

function FormSplitBill({ friends }) {
	return (
		<form className='form-split-bill'>
			<h2>Split a bill with friend.name</h2>
			<label>Bill Value : </label>
			<input
				type='text'
				placeholder='Enter the Total bill value'></input>
			<label>Your share : </label>
			<input
				type='text'
				placeholder='Enter your share value'></input>
			<label>friend.name's share : </label>
			<input
				type='text'
				disabled></input>
			<label>Who is paying the bill? </label>
			<select>
				<option value='user'>you</option>
				<option value='your friend'>friend.name</option>
			</select>
			<Button className='button'>Split Bill</Button>
		</form>
	);
}
