import SectionHeading from "./SectionHeading";

const AboutUs = () => {
    return (
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <SectionHeading title="About Us"></SectionHeading>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-600 text-lg mb-6">
            Welcome to our hostel, a home away from home! We provide a safe, comfortable, and 
            affordable living space with top-notch facilities, including high-speed WiFi, 
            hygienic meals, 24/7 security, and a friendly community environment.
          </p>
          <p className="text-gray-600 text-lg mb-6">
            Our goal is to ensure a peaceful and productive stay for students and professionals, 
            making their journey easier with premium services.
          </p>
        </div>
      </section>
    );
  };
  
  export default AboutUs;
  