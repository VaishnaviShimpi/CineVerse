import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const AuthScreen = () => {
	const [email, setEmail] = useState("");
	const navigate = useNavigate();

	const handleFormSubmit = (e) => {
		e.preventDefault();
		navigate("/signup?email=" + email);
	};

	return (
		<div className='hero-bg relative'>
			{/* Navbar */}
			<header className='max-w-6xl mx-auto flex items-center justify-between p-4 pb-10'>
				<img src='/logo.png' alt='Netflix Logo' className='w-32 md:w-52' />
				<Link to={"/login"} className='text-white bg-red-600 py-1 px-2 rounded'>
					Sign In
				</Link>
			</header>

			{/* hero section */}
			<div className='flex flex-col items-center justify-center text-center py-40 text-white max-w-6xl mx-auto'>
				<h1 className='text-4xl md:text-6xl font-bold mb-4'>Welcome To CineVerse. Your own Streaming Platform</h1>
			</div>

			{/* separator */}
			<div className='h-2 w-full bg-[#232323]' aria-hidden='true' />

			{/* 1st section */}
			<div className='py-10 bg-black text-white'>
				<div className='flex max-w-6xl mx-auto items-center justify-center md:flex-row flex-col px-4 md:px-2'>
					{/* left side */}
					<div className='flex-1 text-center md:text-left'>
						<h2 className='text-4xl md:text-5xl font-extrabold mb-4'>Enjoy Movie Streaming</h2>
						<p className='text-lg md:text-xl'>
							Watch your favorite Movies and Shows all in one place.
						</p>
					</div>
					{/* right side */}
					<div className='flex-1 relative'>
						<img src='/tv.png' alt='Tv image' className='mt-4 z-20 relative' />
						<video
							className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/2 z-10'
							playsInline
							autoPlay={true}
							muted
							loop
						>
							<source src='/hero-vid.mp4' type='video/mp4' />
						</video>
					</div>
				</div>
			</div>

			{/* separator */}
			<div className='h-2 w-full bg-[#232323]' aria-hidden='true' />

			{/* 2nd section */}
			<div className='py-10 bg-black text-white'>
				<div className='flex max-w-6xl mx-auto items-center justify-center md:flex-row flex-col-reverse px-4 md:px-2'>
					{/* left side */}
					<div className='flex-1 relative'>
						<div className='relative'>
							<img src='/MultipleDevice.png' alt='img' className='mt-4' />
					</div>
					</div>

					{/* right side */}

					<div className='flex-1 md:text-left text-center'>
						<h2 className='text-4xl md:text-5xl font-extrabold mb-4 text-balance'>
						Watch on Any Device, Anywhere!
						</h2>
						<p className='text-lg md:text-xl'>
						Stream seamlessly on your phone, tablet, or TV - your entertainment, your way.
						</p>
					</div>
				</div>
			</div>

			{/* separator */}

			<div className='h-2 w-full bg-[#232323]' aria-hidden='true' />

			{/* 3rd section */}
			<div className='py-10 bg-black text-white'>
				<div className='flex max-w-6xl mx-auto items-center justify-center md:flex-row flex-col px-4 md:px-2'>
					{/* left side */}
					<div className='flex-1 text-center md:text-left'>
						<h2 className='text-4xl md:text-5xl font-extrabold mb-4'>Watch. Chat. Celebrate. Together.</h2>
						<p className='text-lg md:text-xl'>
						Enjoy movies and shows in perfect sync with friends, no matter the distance. Chat, react, and make memories together in real time!
						</p>
					</div>

					{/* right side */}
					<div className='flex-1 relative overflow-hidden'>
						<img src='/device-pile.png' alt='Device image' className='mt-4 z-20 relative' />
					</div>
				</div>
			</div>
		</div>
	);
};
export default AuthScreen;
