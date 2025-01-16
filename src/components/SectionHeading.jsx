import React from 'react';

const SectionHeading = ({title, subtitle}) => {
    return (

        


        <div>
            <h1 className='text-center text-3xl font-bold my-12'>{title}</h1>
            <h1>{subtitle}</h1>
        </div>
    );
};

export default SectionHeading;