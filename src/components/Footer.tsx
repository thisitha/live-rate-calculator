import React from 'react';

export const Footer = () => {
    return (
        <footer className="w-full py-6 mt-auto border-t bg-card/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} @kavinda. All rights reserved.</p>
            </div>
        </footer>
    );
};
