import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiCpu, FiTrendingUp, FiCreditCard } from "react-icons/fi";
import "./ImageSlider.css";

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const images = [
    "https://images.unsplash.com/photo-1620207418302-439b387441b0",
    "https://images.unsplash.com/photo-1601597111158-2fceff292cdc",
    "https://images.unsplash.com/photo-1525182008055-f88b95ff7980",
    "https://images.unsplash.com/photo-1554224155-1696413565d3"
  ];

  const slides = [
    {
      id: 1,
      title: "Pay for Everyday Items",
      description: "Buy groceries, airtime, or any commodity with SaSPay",
      icon: FiShoppingCart,
      color: "#3b82f6",
      details: "Support all types of merchants and vendors"
    },
    {
      id: 2,
      title: "Automatic Savings Calculation",
      description: "Set your savings percentage (10% by default)",
      icon: FiCpu,
      color: "#8b5cf6",
      details: "Automatically calculated from each payment"
    },
    {
      id: 3,
      title: "Instant Crypto Conversion",
      description: "Your savings convert to XLM instantly",
      icon: FiTrendingUp,
      color: "#10b981",
      details: "Real-time conversion at fixed rate: 1 XLM = 4500 UGX"
    },
    {
      id: 4,
      title: "Watch Your Wealth Grow",
      description: "See both UGX and XLM balances in your wallet",
      icon: FiCreditCard,
      color: "#f59e0b",
      details: "Track transactions and withdraw anytime"
    }
  ];

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  return (
    <div className="image-slider">
      <div className="slider-container">
        <div className="slides-wrapper">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? "active" : ""}`}
              style={{ "--slide-color": slide.color }}
            >
              <div className="slide-content">
                <div className="slide-icon" style={{ color: slide.color }}>
                  <slide.icon size={48} />
                </div>
                <h3 className="slide-title">{slide.title}</h3>
                <p className="slide-description">{slide.description}</p>
                <p className="slide-details">{slide.details}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button className="slider-btn prev-btn" onClick={goToPrevious}>
          <FiChevronLeft />
        </button>
        <button className="slider-btn next-btn" onClick={goToNext}>
          <FiChevronRight />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="slide-counter">
        <span>{currentSlide + 1}</span>
        <span>/</span>
        <span>{slides.length}</span>
      </div>
    </div>
  );
};

export default ImageSlider;
