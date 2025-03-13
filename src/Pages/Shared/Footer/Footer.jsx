import React from 'react';

const Footer = () => {
    return (
        <footer className="footer sm:footer-horizontal text-base-content p-10 max-w-screen-xl mx-auto">
            <aside>
                <div >
                    <img className='h-20' src="https://i.ibb.co.com/93qhJ1Dy/pic-9.png" alt="" />
                </div>
                <p>
                    Pawkie Ltd.
                    <br />
                    Providing reliable service since 2023
                </p>
            </aside>
            <nav>
                <h6 className="footer-title">Services</h6>
                <a className="link link-hover">Branding</a>
                <a className="link link-hover">Design</a>
                <a className="link link-hover">Marketing</a>
                <a className="link link-hover">Advertisement</a>
            </nav>
            <nav>
                <h6 className="footer-title">Company</h6>
                <a className="link link-hover">About us</a>
                <a className="link link-hover">Contact</a>
                <a className="link link-hover">Jobs</a>
                <a className="link link-hover">Press kit</a>
            </nav>
            <nav>
                <h6 className="footer-title">Legal</h6>
                <a className="link link-hover">Terms of use</a>
                <a className="link link-hover">Privacy policy</a>
                <a className="link link-hover">Cookie policy</a>
            </nav>
        </footer>
    );
};

export default Footer;