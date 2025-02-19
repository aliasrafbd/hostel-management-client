import React from 'react';
import SectionHeading from './SectionHeading';

const FAQ = () => {
    return (
        <>
        <SectionHeading title="Frequently Asked"></SectionHeading>
            <div className=' my-12'>
                <div className="collapse collapse-plus bg-base-200">
                    <input type="radio" name="my-accordion-3" defaultChecked />
                    <div className="collapse-title text-xl font-medium">Who can use this system?</div>
                    <div className="collapse-content">
                        <p>This system is useful for hostel administrators, staff, and residents. It helps manage bookings, payments, and services efficiently.</p>
                    </div>
                </div>
                <div className="collapse collapse-plus bg-base-200">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title text-xl font-medium">Is the system accessible on mobile devices?</div>
                    <div className="collapse-content">
                        <p>Yes, our hostel management system is mobile-friendly and can be accessed from smartphones, tablets, and desktops</p>
                    </div>
                </div>
                <div className="collapse collapse-plus bg-base-200">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title text-xl font-medium">How do I subscribe to meal plans?</div>
                    <div className="collapse-content">
                        <p>You can select and subscribe to meal plans through the Meals by Category section on the dashboard.</p>
                    </div>
                </div>
                <div className="collapse collapse-plus bg-base-200">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title text-xl font-medium">What facilities are available in the hostel?</div>
                    <div className="collapse-content">
                        <p>The hostel provides facilities such as Wi-Fi, laundry, housekeeping, study areas, and recreational spaces. The availability of facilities may vary.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FAQ;