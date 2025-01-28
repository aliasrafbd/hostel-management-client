import React from 'react';

const SectionHeading = ({title, subtitle}) => {
    return (

        <div>
            <h1 className='text-center text-3xl font-bold my-12'>{title}</h1>
            <hr className='my-4 max-w-3xl mx-auto border-slate-400 border-2' />
            <h1>{subtitle}</h1>
        </div>
    );
};

export default SectionHeading;