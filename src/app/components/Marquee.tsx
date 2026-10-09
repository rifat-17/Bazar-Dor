

import React from 'react';

const Marquee = async () => {
        const res = await fetch("https://api.api-store.workers.dev/api/bazardor/products");
        const data = await res.json();
        
    
    return (
        <div>
            
        </div>
    );
};

export default Marquee;