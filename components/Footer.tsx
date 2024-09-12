'use client';

const Footer = () => {
    return (
        <footer className="w-full bg-white text-black py-4">
            <div className="container mx-auto flex flex-col items-center justify-center">
                <p className="text-sm">&copy; 2024 HireMe. All rights reserved.</p>
                <p className="text-sm mt-1">
                    <a href="/privacy-policy" className="hover:underline">
                        Privacy Policy
                    </a>{' '}
                    |{' '}
                    <a href="/terms-of-service" className="hover:underline">
                        Terms of Service
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;