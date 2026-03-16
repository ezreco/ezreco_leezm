import React, { useState, useEffect, useRef } from "react";
import icCancel from "@/assets/icons/ic_cancel.svg";
import table from "@/assets/icons/table.png";
import SecondaryTabGroup from "@/components/SecondaryTabGroup";
import screen1 from "@/assets/icons/screen1.png";
import screen2 from "@/assets/icons/screen2.png";
import tv1 from "@/assets/tvs/tv1.png";
import tv2 from "@/assets/tvs/tv2.png";

import horHandle from "@/assets/icons/horHandle.png";

const SpecTool: React.FC = () => {
  const [products, setProducts] = useState<string[]>([
    "삼성 2025 QLED Q90F",
    "삼성 2025 Neo QLED 65QNF80",
  ]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<"size" | "brightness">("size");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleRemoveProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = () => {
    if (inputValue.trim()) {
      setProducts((prev) => [...prev, inputValue.trim()]);
      setInputValue("");
    }
  };

  // Draw comparison lines on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set line style
    ctx.strokeStyle = "#0106FF";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.setLineDash([1.5, 3]);

    // Draw top line for second TV (larger) - split with 110px gap in middle
    const topLine2Center = (40 + 459) / 2; // 249.5
    const topLine2Gap = 110;
    ctx.beginPath();
    ctx.moveTo(40, 23);
    ctx.lineTo(topLine2Center - topLine2Gap / 2, 23); // left part
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(topLine2Center + topLine2Gap / 2, 23);
    ctx.lineTo(459, 23); // right part
    ctx.stroke();

    // Draw right line for second TV - split with 110px gap in middle
    const rightLine2Center = (35 + 274) / 2; // 154.5
    const rightLine2Gap = 110;
    ctx.beginPath();
    ctx.moveTo(476, 35);
    ctx.lineTo(476, rightLine2Center - rightLine2Gap / 2); // top part
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(476, rightLine2Center + rightLine2Gap / 2);
    ctx.lineTo(476, 274); // bottom part
    ctx.stroke();

    // Draw top line for first TV (smaller) - split with 110px gap in middle
    const topLine1Center = (40 + 369) / 2; // 204.5
    const topLine1Gap = 110;
    ctx.beginPath();
    ctx.moveTo(40, 78);
    ctx.lineTo(topLine1Center - topLine1Gap / 2, 78); // left part
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(topLine1Center + topLine1Gap / 2, 78);
    ctx.lineTo(369, 78); // right part
    ctx.stroke();

    // Draw right line for first TV - split with 110px gap in middle
    const rightLine1Center = (90 + 274) / 2; // 182
    const rightLine1Gap = 110;
    ctx.beginPath();
    ctx.moveTo(386, 90);
    ctx.lineTo(386, rightLine1Center - rightLine1Gap / 2); // top part
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(386, rightLine1Center + rightLine1Gap / 2);
    ctx.lineTo(386, 274); // bottom part
    ctx.stroke();

    // Draw dots at line endpoints
    ctx.setLineDash([]); // Reset dash for solid dots
    ctx.fillStyle = "#0106FF";

    // Top line for second TV - start and end dots
    ctx.beginPath();
    ctx.arc(40, 23, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(459, 23, 2, 0, Math.PI * 2);
    ctx.fill();

    // Right line for second TV - start and end dots
    ctx.beginPath();
    ctx.arc(476, 35, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(476, 274, 2, 0, Math.PI * 2);
    ctx.fill();

    // Top line for first TV - start and end dots
    ctx.beginPath();
    ctx.arc(40, 78, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(369, 78, 2, 0, Math.PI * 2);
    ctx.fill();

    // Right line for first TV - start and end dots
    ctx.beginPath();
    ctx.arc(386, 90, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(386, 274, 2, 0, Math.PI * 2);
    ctx.fill();
  }, [activeTab]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col items-center relative">
        {/* Input Section */}
        <div className="absolute  top-[-128px] flex gap-[16px] items-center">
          <div className="bg-white border border-[#d5d8dc] h-[44px] w-[398px] rounded-[24px] px-[16px] flex items-center py-[2px]">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddProduct();
                }
              }}
              placeholder="비교할 제품명을 입력하세요"
              className="w-full h-full text-[14px] leading-[20px] text-black placeholder:text-[#989ba2] outline-none bg-transparent border-none"
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-[#eef0f3] h-[44px] w-[92px] rounded-[24px] flex items-center justify-center hover:bg-[#e5e6e8] transition-colors"
          >
            <span className="text-black text-[14px] leading-[20px] font-semibold">
              추가
            </span>
          </button>
        </div>

        {/* Size Comparison - Size Tab */}
        {activeTab === "size" && (
          <div className="flex flex-col w-[1160px] h-[510px] items-center  p-[42px] ">
            {/* Product List */}
            <div className="absolute left-[125px] top-[41px] flex flex-col gap-[8px]">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="flex gap-[8px] items-center w-[284px]"
                >
                  <button
                    onClick={() => handleRemoveProduct(index)}
                    className="relative w-[28px] h-[28px] flex-shrink-0 border-1 rounded-full border-[#D5D8DC]"
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <img
                        src={icCancel}
                        alt="Remove"
                        className="w-[18px] h-[18px]"
                      />
                    </div>
                  </button>
                  <p className="text-black text-[16px] leading-[26px] font-normal w-[248px]">
                    {product}
                  </p>
                </div>
              ))}
            </div>

            {/* Comparison Canvas */}
            <div className="relative left-[35px] w-[500px] h-[300px]">
              <canvas
                ref={canvasRef}
                width={500}
                height={300}
                className="absolute inset-0 pointer-events-none"
              />

              {/* Second TV (larger, behind) - 65" */}
              <div className="absolute left-[38px] top-[41px] opacity-20">
                {/* TV Image */}
                <div className="w-[424px] h-[243px] relative">
                  <img
                    src={tv1}
                    alt="TV"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: "center",
                      transform: "scale(1.15)",
                      transformOrigin: "center",
                    }}
                  />
                </div>
              </div>

              {/* Width label for second TV */}
              <div className="absolute left-[250px] top-[46px] -translate-x-1/2 -translate-y-1/2 px-[10px] flex items-center">
                <p className="text-black text-[14px] leading-[20px] font-normal whitespace-nowrap">
                  1889.9mm
                </p>
              </div>

              {/* Height label for second TV */}
              <div className="absolute left-[433px] top-[175px] -translate-y-1/2">
                <div className="rotate-90 px-[10px]">
                  <p className="text-black text-[14px] leading-[20px] font-normal whitespace-nowrap">
                    1083.5mm
                  </p>
                </div>
              </div>

              {/* First TV (smaller, in front) - 55" */}
              <div className="absolute left-[38px] top-[94px]">
                {/* TV Image */}
                <div className="w-[334px] h-[190px] relative">
                  <img
                    src={tv2}
                    alt="TV"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: "center",
                      transform: "scale(1.15)",
                      transformOrigin: "center",
                    }}
                  />
                </div>
              </div>

              {/* Width label for first TV */}
              <div className="absolute left-[205px] top-[100px] -translate-x-1/2 -translate-y-1/2  px-[10px] flex items-center">
                {" "}
                <p className="text-black text-[14px] leading-[20px] font-normal whitespace-nowrap">
                  1446.5mm
                </p>
              </div>

              {/* Height label for first TV */}
              <div className="absolute left-[345px] top-[200px] -translate-y-1/2">
                <div className="rotate-90 px-[10px]">
                  <p className="text-black text-[14px] leading-[20px] font-normal whitespace-nowrap">
                    829.3mm
                  </p>
                </div>
              </div>
            </div>

            <div>
              <img
                src={table}
                alt="table"
                className="w-[1000px] h-[130px] mt-[-9px]"
              ></img>
            </div>
          </div>
        )}

        {/* Brightness Comparison - Brightness Tab */}
        {activeTab === "brightness" && (
          <div className="flex flex-col w-[1160px] h-[510px] items-center bg-white p-[42px] rounded-[20px] border-[1px] border-[#D5D8DC]">
            <div className="flex flex-row justify-between w-[620px] ml-[26px] mb-[21px]">
              {/* Product List for Brightness - Left */}
              <div className="flex gap-[8px] items-center w-[284px]">
                <button className="relative w-[28px] h-[28px] flex-shrink-0 border-1 rounded-full border-[#D5D8DC]">
                  <div className="flex items-center justify-center w-full h-full">
                    <img
                      src={icCancel}
                      alt="Remove"
                      className="w-[18px] h-[18px]"
                    />
                  </div>
                </button>
                <div className="text-black text-[16px] leading-[26px] font-normal w-[248px]">
                  삼성 2025 Neo QLED 65QNF80
                </div>
              </div>

              {/* Product List for Brightness - Right */}
              <div className="flex gap-[8px] items-center w-[284px]">
                <button className="relative w-[28px] h-[28px] flex-shrink-0 border-1 rounded-full border-[#D5D8DC]">
                  <div className="flex items-center justify-center w-full h-full">
                    <img
                      src={icCancel}
                      alt="Remove"
                      className="w-[18px] h-[18px]"
                    />
                  </div>
                </button>
                <div className="text-black text-[16px] leading-[26px] font-normal w-[248px]">
                  삼성 2025 QLED Q90F
                </div>
              </div>
            </div>

            <div className=" w-[660px] h-[384px] flex gap-0">
              {/* Left TV Image */}
              <div className="relative w-[330px] h-[384px] overflow-hidden">
                <img
                  src={screen1}
                  alt="TV Left"
                  className="absolute left-[26px] top-[12px] w-[610px] h-[350px] object-contain"
                  style={{
                    objectPosition: "left",
                  }}
                />
                <div className="absolute left-[105px] top-[362px] w-[4px] h-[22px] bg-[#252525]" />
              </div>

              {/* Center Divider */}
              <div className="relative w-[2px] h-[384px]">
                <div className="absolute left-[3px] top-[14px] w-[2px] h-[350px] bg-white" />
                <div className="absolute left-0 top-[169px] w-[8px] h-[28px]">
                  <img
                    src={horHandle}
                    alt="handle"
                    className="absolute left-[-3px] w-full h-full z-[100]"
                  />
                </div>
              </div>

              {/* Right TV Image */}
              <div className="relative w-[330px] h-[384px] overflow-hidden">
                <img
                  src={screen2}
                  alt="TV Right"
                  className="absolute left-[-304px] top-[12px] w-[608px] h-[350px] object-contain"
                  style={{
                    objectPosition: "right",
                  }}
                />
                <div className="absolute left-[221px] top-[362px] w-[4px] h-[22px] bg-[#252525]" />
              </div>
            </div>
          </div>
        )}

        {/* Secondary Tab Group - Fixed Position */}
        <div className="mt-[70px]">
          <SecondaryTabGroup
            tabs={[
              { id: "size", label: "사이즈" },
              { id: "brightness", label: "밝기" },
            ]}
            activeTabId={activeTab}
            onTabChange={(tabId) =>
              setActiveTab(tabId as "size" | "brightness")
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SpecTool;
