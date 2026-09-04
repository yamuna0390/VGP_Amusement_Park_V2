"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  Keyboard,
  A11y,
  EffectFade
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function SharedSlider({
  items,
  renderItem,
  slidesPerView = 1,
  spaceBetween = 0,
  breakpoints,
  loop = true,
  autoplayDelay = 5000,
  speed = 650,
  paginationEl,
  navigationProps,
  showProgressBar = false,
  containerClassName = "",
  swiperClassName = "",
  progressTrackClassName = "bs-progress-track",
  progressBarClassName = "bs-progress-bar",
  children,
  onSwiper,
  effect,
  fadeEffect,
  ...rest
}) {
  const progressRef = useRef(null);

  const modules = [Autoplay, Keyboard, A11y];
  if (paginationEl) modules.push(Pagination);
  if (navigationProps) modules.push(Navigation);
  if (effect === "fade") modules.push(EffectFade);

  return (
    <div className={containerClassName}>
      <Swiper
        className={swiperClassName}
        modules={modules}
        loop={loop}
        autoplay={{ delay: autoplayDelay, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={paginationEl ? { clickable: true, el: paginationEl } : false}
        navigation={navigationProps || false}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        speed={speed}
        grabCursor
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        breakpoints={breakpoints}
        effect={effect}
        fadeEffect={fadeEffect}
        onSwiper={onSwiper}
        {...rest}
        onAutoplayTimeLeft={showProgressBar ? (s, _time, progress) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${1 - progress})`;
          }
        } : undefined}
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.id || index}>
            {({ isActive }) => renderItem(item, index, isActive)}
          </SwiperSlide>
        ))}
      </Swiper>
      {children}
      {showProgressBar && (
        <div className={progressTrackClassName} aria-hidden="true">
          <div className={progressBarClassName} ref={progressRef} />
        </div>
      )}
    </div>
  );
}
