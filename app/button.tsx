import React from 'react';
import '../styles/index.css'; 

interface ButtonNavigateProps {
    title: string;
    href: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const ButtonNavigate: React.FC<ButtonNavigateProps> = ({ title, href, onClick }) => {
    return (
        <a 
            href={href} 
            className="relative p-0.5 bg-gradient-light dark:bg-gradient-dark rounded-full flex items-center group"
            onClick={onClick}
        >
            <span className="px-[18px] py-2 bg-[var(--color-background)] button-font text-[var(--color-text)] text-lg rounded-full w-[90%] flex items-center justify-center transition-all duration-300 ease-out whitespace-nowrap group-hover:w-[100%]">
                {title} 
            </span>
        </a>
    );
};

export default ButtonNavigate;
