import React from 'react';
import footer from '../../../assets/footer.png'

const Footer = () => {
    return (
        <footer className="footer sm:footer-horizontal text-[#F7B385] p-10 max-w-screen-xl mx-auto">
            <aside>
                <img className='h-20 mb-2' src={footer} alt="Pawkie Logo" />
                <p className="text-sm">
                    <span className="text-lg font-bold">Pawkie Ltd.</span><br />
                    Providing reliable service since 2023
                </p>
            </aside>
            <nav>
                <h6 className="footer-title text-lg text-white">Services</h6>
                <a className="link link-hover hover:underline">Branding</a>
                <a className="link link-hover hover:underline">Design</a>
                <a className="link link-hover hover:underline">Marketing</a>
                <a className="link link-hover hover:underline">Advertisement</a>
            </nav>
            <nav>
                <h6 className="footer-title text-lg text-white">Company</h6>
                <a className="link link-hover hover:underline">About us</a>
                <a className="link link-hover hover:underline">Contact</a>
                <a className="link link-hover hover:underline">Jobs</a>
                <a className="link link-hover hover:underline">Press kit</a>
            </nav>
            <nav>
                <h6 className="footer-title text-lg text-white">Legal</h6>
                <a className="link link-hover hover:underline">Terms of use</a>
                <a className="link link-hover hover:underline">Privacy policy</a>
                <a className="link link-hover hover:underline">Cookie policy</a>
            </nav>
        </footer>
    );
};

export default Footer;
