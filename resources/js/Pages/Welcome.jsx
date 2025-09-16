import { Head, Link } from '@inertiajs/react';
import background from '../../img/background.png';
import logo from '../../img/ToDoList-Logo.png';
import logoBlack from '../../img/logo-black.png';
import hero from '../../img/hero-section.png';

export default function Welcome({ auth }) 
{

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-[#E4EEF0] text-black/50">
                <img
                    id="bg"
                    className="absolute left-0 top-0 w-screen h-screen"
                    src={background}
                />
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#F05416] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="h-auto grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:justify-center justify-self-start text-left">
                                <img src={logoBlack} alt="" className='h-12 w-auto'/>
                            </div>
                            <nav className="-mx-3 flex flex-1 lg:col-start-3 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 hover:bg-[#22162B] hover:text-white hover:scale-110 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none border-2 border-solid border-[#22162B]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 hover:bg-[#22162B] hover:text-white hover:scale-110 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none border-2 border-solid border-[#22162B]"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md ml-4 px-3 py-2 hover:bg-[#22162B] hover:text-white hover:scale-110 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none border-2 border-solid border-[#22162B]"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-6">
                            <div className='w-full flex justify-between items-center'>
                                <div className="flex gap-8">
                                    <img src={logo} alt="ToDoList Logo" className='w-[280px] h-[280px]' />
                                    <div className="max-w-lg flex flex-col gap-4">
                                        <h1 className="text-7xl font-semibold text-[#22162B]">To-Do <span className="text-[#075056]">List</span></h1>
                                        <p className="text-[#484848]">Atur semua kegiatanmu dengan mudah. Satu tempat untuk semua rencana, target, dan ide.</p>
                                        <div>
                                        
                                        {auth.user ? (
                                            <>
                                                <button
                                                onClick={() => window.location.href = route('dashboard')}
                                                type='button'
                                                className="mt-4 w-2/5 rounded-full bg-[#22162B] px-4 py-2 text-white transition hover:-top-3 hover:scale-105 hover:drop-shadow-lg">
                                                Open Dashboard
                                                </button>

                                                <div className="mt-4 text-sm">
                                                    You are logged in as {auth.user.email}
                                                </div>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => window.location.href = route('register')}
                                                type='button'
                                                className="mt-4 w-2/5 rounded-full bg-[#22162B] px-4 py-2 text-white transition hover:-top-3 hover:scale-105 hover:drop-shadow-lg">
                                                Get Started
                                            </button>
                                        )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <img src={hero} alt="Hero Section" />
                                </div>
                            </div>
                        </main>

                        <footer className="pt-16 text-center text-sm text-black ">
                            &copy; 2025 Alfian <br />
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
