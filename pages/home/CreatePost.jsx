
import { useRef, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";

// const EditProfileModal = ({ authUser }) => {
// 	const [formData, setFormData] = useState({
// 		fullName: "",
// 		username: "",
// 		email: "",
// 		bio: "",
// 		link: "",
// 		newPassword: "",
// 		currentPassword: "",
// 	});

// 	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

// 	const handleInputChange = (e) => {
// 		setFormData({ ...formData, [e.target.name]: e.target.value });
// 	};



const CreatePost = () => {
	const [text, setText] = useState("");
	const [link, setLink] = useState("");
	const imgRef = useRef(null);
	const [formData] = useState({
				link: "",
	});
		const handleInputChange = (e) => {
		({ ...formData, [e.target.name]: e.target.value });	};



	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const {
		mutate: createPost,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ text, img, link }) => {
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, img, link}),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},

		onSuccess: () => {
			setText("");
			
			setLink("");
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({ text, link });
	};

	
	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800 '
					placeholder='Add a link !?'
					value={text}
					onChange={(e) => setText(e.target.value)}
					
				/>
			     
				 <input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={(e) => setText(e.target.value)}
					// 		onChange={handleInputChange}
                      />

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					
					
					  {/* <input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>  */}
					
					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>{error.message}</div>}
			</form>
		</div>
	);
};
export default CreatePost;