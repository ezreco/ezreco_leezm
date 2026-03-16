import React from "react";
import type { Reviews } from "../store/aiRecommendResultStore";
import reviewStarIcon from "../assets/result/review_star.svg";

interface ProductReviewsProps {
  reviews: Reviews;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews }) => {
  return (
    <div className="w-full">
      {/* Title */}
      <div className="text-[18px] font-semibold leading-[24px] text-black mb-[32px]">
        {reviews.title}
      </div>

      {/* Expert Review Section */}
      <div className="mb-[40px]">
        {/* Header */}
        <div className="flex items-center gap-[24px] mb-[14px]">
          <div className="flex items-end gap-[4px]">
            <img
              src={reviews.expertReview.icon}
              alt="expert"
              className="w-[42px] h-[42px]"
            />
            <span className="text-[14px] font-semibold leading-[20px] text-black">
              {reviews.expertReview.title}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="text-[14px] leading-[20px] text-black mb-[24px] whitespace-pre-line">
          {reviews.expertReview.description}
        </div>

        {/* Review Cards */}
        <div className="flex gap-[13px]">
          {reviews.expertReview.cards.map((card, index) => (
            <div
              key={index}
              className="w-[252px] h-[176px] bg-white border border-[#d5d8dc] rounded-[20px] overflow-hidden"
            >
              {/* Image */}
              <div className="w-[250px] h-[135px] overflow-hidden rounded-t-[19px] mx-[1px] mt-[1px]">
                <img
                  src={card.imageUrl}
                  alt="review"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Badge and Logo */}
              <div className="flex items-center gap-[8px] px-[20px] pt-[14px]">
                <img
                  src={card.logoUrl}
                  alt="logo"
                  className="h-[12px] object-contain"
                />
                <span className="text-[12px] leading-[16px] text-[#252525]">
                  {card.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Review Section */}
      <div>
        {/* Header */}
        <div className="flex items-center gap-[24px] mb-[14px]">
          <div className="flex items-end gap-[4px]">
            <img
              src={reviews.userReview.icon}
              alt="user"
              className="w-[42px] h-[42px]"
            />
            <span className="text-[14px] font-semibold leading-[20px] text-black">
              {reviews.userReview.title}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="text-[14px] leading-[20px] text-black mb-[24px] whitespace-pre-line">
          {reviews.userReview.description}
        </div>

        {/* User Review Cards */}
        <div className="flex gap-[13px] mb-[40px]">
          {reviews.userReview.cards.map((card, index) => (
            <div
              key={index}
              className="w-[252px] h-[176px] bg-white border border-[#d5d8dc] rounded-[20px] overflow-hidden"
            >
              {/* Image */}
              <div className="w-[250px] h-[135px] overflow-hidden rounded-t-[19px] mx-[1px] mt-[1px]">
                <img
                  src={card.imageUrl}
                  alt="review"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Badge and Logo */}
              <div className="flex items-center gap-[8px] px-[20px] pt-[14px]">
                <img
                  src={card.logoUrl}
                  alt="logo"
                  className="h-[18px] w-[18px] rounded-[10px] object-contain"
                />
                <span className="text-[12px] leading-[16px] text-[#252525]">
                  {card.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* User Reviews */}
        <div className="space-y-[40px]">
          {reviews.userReview.reviews.map((review, index) => (
            <div key={index}>
              {/* Platform Logo */}
              <div className="mb-[12px]">
                <img
                  src={review.platformLogo}
                  alt={review.platform}
                  className="h-[16px] object-contain"
                />
              </div>

              {review.platform === "amazon" ? (
                // Amazon Review
                <div>
                  {/* Author */}
                  <div className="flex items-center gap-[6px] mb-[8px]">
                    {review.authorAvatar && (
                      <div className="relative w-[22px] h-[22px]">
                        <img
                          src={review.authorAvatar}
                          alt={review.author}
                          className="w-[22px] h-[22px]"
                        />
                      </div>
                    )}
                    <span className="text-[12px] leading-[16px] text-[#252525]">
                      {review.author}
                    </span>
                  </div>

                  {/* Stars and Title */}
                  {review.rating && review.title && (
                    <div className="flex items-center gap-[6px] mb-[6px]">
                      {/* Stars */}
                      <div className="flex gap-[2px]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <img
                            key={i}
                            src={reviewStarIcon}
                            alt="star"
                            className="w-[12px] h-[11px]"
                            style={{
                              filter:
                                i < (review.rating ?? 0)
                                  ? "none"
                                  : "brightness(0) saturate(100%) invert(88%) sepia(6%) saturate(211%) hue-rotate(185deg) brightness(91%) contrast(85%)",
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[12px] font-semibold leading-[16px] text-[#252525]">
                        {review.title}
                      </span>
                    </div>
                  )}

                  {/* Date */}
                  {review.date && (
                    <div className="text-[12px] font-semibold leading-[16px] text-[#989ba2] mb-[4px]">
                      {review.date}
                    </div>
                  )}

                  {/* Metadata */}
                  {review.metadata && (
                    <div className="flex items-center gap-[6px] mb-[14px]">
                      {review.metadata.size && (
                        <>
                          <span className="text-[12px] font-semibold leading-[16px] text-[#989ba2]">
                            크기: {review.metadata.size}
                          </span>
                          <div className="w-px h-[10px] bg-[#d5d8dc]" />
                        </>
                      )}
                      {review.metadata.style && (
                        <>
                          <span className="text-[12px] font-semibold leading-[16px] text-[#989ba2]">
                            스타일: {review.metadata.style}
                          </span>
                          <div className="w-px h-[10px] bg-[#d5d8dc]" />
                        </>
                      )}
                      {review.metadata.verified && (
                        <span className="text-[12px] font-semibold leading-[16px] text-[#ff9500]">
                          확인된 구매
                        </span>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="text-[12px] leading-[16px] text-[#252525] whitespace-pre-line">
                    {review.content}
                  </div>
                </div>
              ) : (
                // Reddit Review
                <div>
                  {/* Author and Date */}
                  <div className="flex items-center gap-[6px] mb-[8px]">
                    {review.authorAvatar && (
                      <div className="w-[22px] h-[22px] rounded-full bg-[#d5d8dc] overflow-hidden">
                        <img
                          src={review.authorAvatar}
                          alt={review.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-[12px] font-semibold leading-[16px] text-[#252525]">
                      {review.author}
                    </span>
                    <span className="text-[12px] font-semibold leading-[16px] text-[#989ba2]">
                      ·
                    </span>
                    {review.date && (
                      <span className="text-[12px] leading-[16px] text-[#989ba2]">
                        {review.date}
                      </span>
                    )}
                  </div>

                  {/* Divider and Content */}
                  <div className="flex gap-[17.5px]">
                    {/* Divider */}
                    <div className="w-px h-[29px] bg-[#d5d8dc] ml-[10.5px]" />

                    {/* Content */}
                    <div className="text-[12px] leading-[16px] text-[#252525] whitespace-pre-line flex-1">
                      {review.content}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
