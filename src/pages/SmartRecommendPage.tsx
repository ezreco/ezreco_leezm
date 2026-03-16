import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BubbleAI from "../components/BubbleAI";
import BubbleUser from "../components/BubbleUser";
import BubbleLoading from "../components/BubbleLoading";
import InputSection from "../components/InputSection";
import InfoPanel from "../components/InfoPanel";
import ResultPanel from "../components/ResultPanel";
import AuxChooseInput from "../components/AuxChooseInput";
import AuxRangeInput from "../components/AuxRangeInput";
import AuxChooseAndRange from "../components/AuxChooseAndRange";
import InferenceView from "../components/InferenceView";
import InferenceDialog from "../components/InferenceDialog";
import ButtonTextIcon from "../components/ButtonTextIcon";
import InferenceLoadingAnimation from "../components/InferenceLoadingAnimation";
import RecommendResultBubble from "../components/RecommendResultBubble";
import {
  aiResponseStore,
  type AuxInputContent,
  type UserPreferences,
} from "../store/aiResponseStore";
import { aiRecommendResultStore } from "../store/aiRecommendResultStore";
import { useSidePanel } from "../contexts/SidePanelContext";

// Generate unique ID
let messageIdCounter = 0;
const generateUniqueId = () => {
  messageIdCounter++;
  return `${Date.now()}_${messageIdCounter}`;
};

interface Message {
  id: string;
  type: "user" | "assistant" | "inference" | "loading";
  content: string;
  options?: string[];
  timestamp: Date;
}

// interface TabButton {
//   id: string;
//   label: string;
//   type?: "primary" | "secondary";
// }

const SmartRecommendPage: React.FC = () => {
  const location = useLocation();
  const initialMessage = location.state?.message || "";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const hasInitialized = useRef(false);
  const { setShowSidePanel } = useSidePanel();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "user",
      content: initialMessage || "24년 삼성티비 300만원 가격대 하나 추천해줘",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  // Handle input value change
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };
  const [showAuxiliaryInputs, setShowAuxiliaryInputs] = useState(true);
  const [currentAuxInput, setCurrentAuxInput] =
    useState<AuxInputContent | null>(null);
  const [selectedRange, setSelectedRange] = useState<[number, number]>([0, 4]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const [showInference, setShowInference] = useState(false);
  const [isInferencing, setIsInferencing] = useState(false);
  const [incomeResult, setIncomeResult] = useState(false);
  const [showInferenceDialog, setShowInferenceDialog] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [layoutKey] = useState(0);

  // Update side panel visibility when InfoPanel or ResultPanel is shown
  useEffect(() => {
    const shouldShowSidePanel =
      (!showInference && !isInferencing) || incomeResult;
    setShowSidePanel(shouldShowSidePanel);

    // Cleanup: set to false when component unmounts
    return () => {
      setShowSidePanel(false);
    };
  }, [showInference, isInferencing, incomeResult, setShowSidePanel]);

  // const [selectedTabs] = useState<TabButton[]>([
  //   { id: "1", label: "영화 시청", type: "primary" },
  //   { id: "2", label: "뉴스 시청", type: "secondary" },
  //   { id: "3", label: "유직비디오 시청", type: "secondary" },
  //   { id: "4", label: "잘 모르겠음", type: "secondary" },
  //   { id: "5", label: "입력", type: "secondary" },
  // ]);

  const generateAIResponse = (userMessage: string) => {
    const response = aiResponseStore.getResponse(userMessage);

    // Update user preferences state
    const updatedPrefs = aiResponseStore.getUserPreferences();
    console.log("[SmartRecommendPage] User message:", userMessage);
    console.log("[SmartRecommendPage] Updated preferences:", updatedPrefs);
    setUserPreferences(updatedPrefs);

    // Check if inference should be shown
    if (response.showInference) {
      setLastUserMessage(userMessage); // Store for inference completion

      // Wait 2 seconds to show the last preference card before transitioning to inference
      setTimeout(() => {
        setShowInference(true);
        setIsInferencing(true);

        // Add inference message to chat
        const inferenceMessage: Message = {
          id: generateUniqueId(),
          type: "inference",
          content: "",
          timestamp: new Date(),
        };
        setTimeout(() => {
          setMessages((prev) => [...prev, inferenceMessage]);
        }, 1000);
      }, 2000); // 2 second delay to show last preference card

      return null; // Don't generate message yet, wait for inference to complete
    }

    // Update aux input based on response
    if (response.auxInput) {
      setCurrentAuxInput(response.auxInput);
      setShowAuxiliaryInputs(true);

      // Set default range if it's a range type
      if (
        response.auxInput.type === "range" &&
        response.auxInput.range?.defaultRange
      ) {
        setSelectedRange(response.auxInput.range.defaultRange);
      }
    } else {
      setCurrentAuxInput(null);
      setShowAuxiliaryInputs(false);
    }

    const aiMessage: Message = {
      id: generateUniqueId(),
      type: "assistant",
      content: response.message || "",
      options: response.options,
      timestamp: new Date(),
    };
    return aiMessage;
  };

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      // 모든 '#' 제거
      const cleanedMessage = message.replace(/#/g, "").trim();

      // both 타입인 경우 메시지를 하나로 합쳐서 처리
      if (currentAuxInput?.type === "both") {
        // 입력값을 공백으로 split
        const parts = cleanedMessage.split(/\s+/).filter((p) => p.trim());

        if (parts.length >= 2) {
          // 하나의 버블로 표시 (라이프스타일 + 예산)
          const combinedMessage: Message = {
            id: generateUniqueId(),
            type: "user",
            content: cleanedMessage, // 전체 메시지를 하나로 표시
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, combinedMessage]);
          setInputValue(""); // Clear input after sending
          setShowAuxiliaryInputs(false);
          setShowSubmitButton(false);

          // Show loading bubble first
          const loadingId = generateUniqueId();
          const loadingMessage: Message = {
            id: loadingId,
            type: "loading",
            content: "",
            timestamp: new Date(),
          };

          setTimeout(() => {
            setMessages((prev) => [...prev, loadingMessage]);

            // Replace loading with AI response after 1.5s
            setTimeout(() => {
              const aiResponse1 = generateAIResponse(parts[0]);
              if (aiResponse1) {
                setMessages((prev) =>
                  prev.map((msg) => (msg.id === loadingId ? aiResponse1 : msg))
                );
              }

              // 두 번째 값으로 AI 응답 생성
              setTimeout(() => {
                const loadingId2 = generateUniqueId();
                const loadingMessage2: Message = {
                  id: loadingId2,
                  type: "loading",
                  content: "",
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, loadingMessage2]);

                setTimeout(() => {
                  const aiResponse2 = generateAIResponse(
                    parts.slice(1).join(" ")
                  );
                  if (aiResponse2) {
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === loadingId2 ? aiResponse2 : msg
                      )
                    );
                  }
                }, 1500);
              }, 1000);
            }, 1500);
          }, 1000);

          return;
        }
      }

      // 일반 메시지 처리
      const newMessage: Message = {
        id: generateUniqueId(),
        type: "user",
        content: cleanedMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputValue(""); // Clear input after sending

      // AuxChooser 숨기기 및 submit 버튼 숨기기
      setShowAuxiliaryInputs(false);
      setShowSubmitButton(false);

      // Show loading bubble first
      const loadingId = generateUniqueId();
      const loadingMessage: Message = {
        id: loadingId,
        type: "loading",
        content: "",
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, loadingMessage]);

        // Replace loading with AI response after 1.5s
        setTimeout(() => {
          const aiResponse = generateAIResponse(cleanedMessage);
          if (aiResponse) {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === loadingId ? aiResponse : msg))
            );
          }
        }, 1500);
      }, 1000);
    }
  };

  const handleOptionClick = (option: string) => {
    const newMessage: Message = {
      id: generateUniqueId(),
      type: "user",
      content: option,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Show loading bubble first
    const loadingId = generateUniqueId();
    const loadingMessage: Message = {
      id: loadingId,
      type: "loading",
      content: "",
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, loadingMessage]);

      // Replace loading with AI response after 1.5s
      setTimeout(() => {
        const aiResponse = generateAIResponse(option);
        if (aiResponse) {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === loadingId ? aiResponse : msg))
          );
        }
      }, 1500);
    }, 1000);
  };

  const handleAuxiliaryOptionClick = (label: string) => {
    // AuxChooseInput 버튼 클릭 시 InputSection에 #+ 버튼 타이틀 추가
    const formattedText = `#${label}`;
    setInputValue((prevValue) => {
      // 기존 텍스트가 있으면 공백 추가 후 새 텍스트, 없으면 그냥 새 텍스트
      return prevValue.trim() ? `${prevValue} ${formattedText}` : formattedText;
    });
    setShowSubmitButton(true);
  };

  const handleMultiSelect = (selectedIds: string[]) => {
    // Convert selectedIds to labels
    const selectedLabels =
      currentAuxInput?.options
        ?.filter((opt) => selectedIds.includes(opt.id))
        .map((opt) => opt.label) || [];

    if (selectedLabels.length > 0) {
      const combinedLabel = selectedLabels.join(", ");
      const newMessage: Message = {
        id: generateUniqueId(),
        type: "user",
        content: combinedLabel,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setShowAuxiliaryInputs(false);

      // Show loading bubble first
      const loadingId = generateUniqueId();
      const loadingMessage: Message = {
        id: loadingId,
        type: "loading",
        content: "",
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, loadingMessage]);

        // Replace loading with AI response after 1.5s
        setTimeout(() => {
          const aiResponse = generateAIResponse(combinedLabel);
          if (aiResponse) {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === loadingId ? aiResponse : msg))
            );
          }
        }, 1500);
      }, 1000);
    }
  };

  const handleRangeSelect = () => {
    // Convert selected range to text
    const rangeValues = currentAuxInput?.range?.values || [];
    const startValue = rangeValues[selectedRange[0]]?.label;
    const endValue = rangeValues[selectedRange[1]]?.label;
    const rangeText =
      startValue === endValue ? startValue : `${startValue} ~ ${endValue}`;

    const newMessage: Message = {
      id: generateUniqueId(),
      type: "user",
      content: rangeText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setShowAuxiliaryInputs(false);

    // Show loading bubble first
    const loadingId = generateUniqueId();
    const loadingMessage: Message = {
      id: loadingId,
      type: "loading",
      content: "",
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, loadingMessage]);

      // Replace loading with AI response after 1.5s
      setTimeout(() => {
        const aiResponse = generateAIResponse(rangeText);
        if (aiResponse) {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === loadingId ? aiResponse : msg))
          );
        }
      }, 1500);
    }, 1000);
  };

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showInference]);

  // Force re-render when auxiliary inputs change
  useEffect(() => {
    // setLayoutKey((prev) => prev + 1);
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [showAuxiliaryInputs, currentAuxInput]);

  // Observe chat container content height changes and auto-scroll
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const resizeObserver = new ResizeObserver(() => {
      scrollToBottom();
    });

    // Observe the chat container for size changes
    resizeObserver.observe(chatContainer);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Store the last user message for inference completion
  const [, setLastUserMessage] = useState<string>("");

  // Generate initial AI response when component mounts
  useEffect(() => {
    if (hasInitialized.current) return;

    if (messages.length === 1 && messages[0].type === "user") {
      hasInitialized.current = true;

      // Show loading bubble first
      const loadingId = generateUniqueId();
      const loadingMessage: Message = {
        id: loadingId,
        type: "loading",
        content: "",
        timestamp: new Date(),
      };

      setTimeout(() => {
        if (messages.length === 1 && messages[0].type === "user") {
          setMessages((prev) => [...prev, loadingMessage]);

          // Replace loading with AI response after 1.5s
          setTimeout(() => {
            const aiResponse = generateAIResponse(messages[0].content);
            if (aiResponse) {
              setMessages((prev) =>
                prev.map((msg) => (msg.id === loadingId ? aiResponse : msg))
              );
            }
          }, 1500);
        }
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle inference completion - Auto-close after inference is complete
  const handleInferenceComplete = () => {
    // Close inference view and show results
    setShowInference(false);
    setTimeout(() => {
      setIsInferencing(false);
      setShowInference(false);
      setIncomeResult(true);
    }, 300);
  };

  // Handle voice chat button click
  const handleVoiceChatClick = () => {
    navigate("/voice-chat");
  };

  return (
    <div className="flex h-screen">
      {showInference ? (
        // Full screen inference view (no InfoPanel)
        <div className="flex flex-row w-full">
          <div className="flex-1 flex flex-col relative ">
            {/* Header */}
            <div className="text-center pt-[60px] pb-[40px] ">
              <div className="text-[18px] font-semibold text-[#1a1a1a]">
                스마트 추천
              </div>
            </div>

            {/* Inference View */}
            <div className="flex-1 overflow-hidden">
              <InferenceView
                onComplete={handleInferenceComplete}
                onHide={() => {
                  setShowInference(false);
                  setTimeout(() => {
                    setIsInferencing(false);
                    setShowInference(false);
                    setIncomeResult(true);
                  }, 1000);
                }}
                userMessage={messages[0]?.content}
              />
            </div>
          </div>
        </div>
      ) : (
        // Normal chat view with InfoPanel
        <>
          {/* Main Content Area */}
          <div key={layoutKey} className="flex flex-col h-screen ">
            {/* Chat Area - takes remaining space */}
            <div className="flex-1 overflow-y-auto flex flex-col w-[890px]">
              {/* Header */}
              <div className="text-center pt-[60px] pb-[40px]">
                <div className="text-[18px] font-semibold text-[#1a1a1a]">
                  스마트 추천
                </div>
              </div>

              {/* Chat Messages Area */}
              <div
                ref={chatContainerRef}
                className="flex-1 px-8 py-8 overflow-y-auto"
              >
                <div className="w-full pb-[100px] ">
                  {/* All Messages */}
                  {messages
                    .filter((message) => {
                      // Remove loading messages when inferencing or result is shown
                      if (
                        message.type === "loading" &&
                        (isInferencing || incomeResult)
                      ) {
                        return false;
                      }
                      return true;
                    })
                    .map((message) => (
                      <div key={message.id}>
                        {message.type === "inference" ? (
                          // Inference message with loading indicator and button
                          <>
                            <div className="mb-[16px] text-left">
                              <div className="inline-flex flex-col items-start gap-4">
                                <ButtonTextIcon
                                  text="추천 과정 보기"
                                  onClick={() => setShowInferenceDialog(true)}
                                />
                                {isInferencing && (
                                  <InferenceLoadingAnimation
                                    size={100}
                                    fps={30}
                                    loop={true}
                                    showText={true}
                                  />
                                )}
                              </div>
                            </div>
                            {/* Recommendation Results */}
                            {incomeResult && (
                              <div className="mb-[16px]">
                                <RecommendResultBubble
                                  products={aiRecommendResultStore.getProducts()}
                                  reviews={
                                    aiRecommendResultStore.getResult()?.reviews
                                  }
                                  ottTips={
                                    aiRecommendResultStore.getResult()?.ottTips
                                  }
                                />
                              </div>
                            )}
                          </>
                        ) : message.type === "assistant" && message.options ? (
                          // AI Options
                          message.options.map((option, optionIdx) => (
                            <div
                              key={`${message.id}-option-${optionIdx}`}
                              className="text-left mb-[16px]"
                            >
                              <BubbleAI>
                                <button
                                  onClick={() => handleOptionClick(option)}
                                  className="text-left w-full"
                                >
                                  {option}
                                </button>
                              </BubbleAI>
                            </div>
                          ))
                        ) : message.type === "loading" ? (
                          // Loading message
                          <div className="mb-[16px] text-left">
                            <BubbleLoading />
                          </div>
                        ) : (
                          // Regular messages
                          <div
                            className={`mb-[16px] ${
                              message.type === "user"
                                ? "text-right"
                                : "text-left"
                            }`}
                          >
                            {message.type === "user" ? (
                              <BubbleUser>{message.content}</BubbleUser>
                            ) : (
                              <BubbleAI>{message.content}</BubbleAI>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  {/* Invisible element to scroll to */}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
            {/* Input Section */}
            <InputSection
              placeholder="EZRoco에게 추가 답변을 입력주세요."
              value={inputValue}
              onChange={handleInputChange}
              onSubmit={handleSendMessage}
              onVoiceChatClick={handleVoiceChatClick}
              maxWidthClass="max-w-[822px]"
              minWidthClass="min-w-[822px]"
              submitIcon={true}
              showSubmitButton={showSubmitButton}
              position="relative"
              auxiliaryInputs={
                showAuxiliaryInputs && currentAuxInput ? (
                  currentAuxInput.type === "choose" ? (
                    <AuxChooseInput
                      options={
                        currentAuxInput.options?.map((opt) => ({
                          ...opt,
                          onClick: () => handleAuxiliaryOptionClick(opt.label),
                        })) || []
                      }
                      onOptionClick={handleAuxiliaryOptionClick}
                      onSend={() => {
                        if (inputValue.trim()) {
                          handleSendMessage(inputValue);
                          setShowAuxiliaryInputs(false);
                        }
                      }}
                      onDirectInput={(value) => {
                        const formattedText = `#${value}`;
                        setInputValue((prevValue) => {
                          // 기존 텍스트가 있으면 공백 추가 후 새 텍스트, 없으면 그냥 새 텍스트
                          return prevValue.trim()
                            ? `${prevValue} ${formattedText}`
                            : formattedText;
                        });
                        setShowSubmitButton(true);
                      }}
                      onMultiSelect={handleMultiSelect}
                      alwaysShowSend={false}
                      hideRightButton={true}
                      containerWidth={800}
                    />
                  ) : currentAuxInput.type === "range" ? (
                    <AuxRangeInput
                      values={currentAuxInput.range?.values || []}
                      selectedRange={selectedRange}
                      onRangeChange={setSelectedRange}
                      onSend={handleRangeSelect}
                      onRangeSelect={(rangeText) => {
                        const formattedText = `#${rangeText}`;
                        setInputValue((prevValue) => {
                          return prevValue.trim()
                            ? `${prevValue} ${formattedText}`
                            : formattedText;
                        });
                        setShowSubmitButton(true);
                      }}
                    />
                  ) : currentAuxInput.type === "both" ? (
                    <AuxChooseAndRange
                      chooseOptions={
                        currentAuxInput.chooseOptions?.map((opt) => ({
                          ...opt,
                          onClick: () => handleAuxiliaryOptionClick(opt.label),
                        })) || []
                      }
                      onOptionClick={handleAuxiliaryOptionClick}
                      onChooseSend={() => {
                        if (inputValue.trim()) {
                          handleSendMessage(inputValue);
                          setShowAuxiliaryInputs(false);
                        }
                      }}
                      onDirectInput={(value) => {
                        const formattedText = `#${value}`;
                        setInputValue((prevValue) => {
                          return prevValue.trim()
                            ? `${prevValue} ${formattedText}`
                            : formattedText;
                        });
                        setShowSubmitButton(true);
                      }}
                      onMultiSelect={handleMultiSelect}
                      alwaysShowChooseSend={false}
                      hideChooseRightButton={true}
                      chooseContainerWidth={800}
                      rangeValues={currentAuxInput.rangeConfig?.values || []}
                      selectedRange={selectedRange}
                      onRangeChange={setSelectedRange}
                      onRangeSend={handleRangeSelect}
                      onRangeSelect={(rangeText) => {
                        const formattedText = `#${rangeText}`;
                        setInputValue((prevValue) => {
                          return prevValue.trim()
                            ? `${prevValue} ${formattedText}`
                            : formattedText;
                        });
                        setShowSubmitButton(true);
                      }}
                    />
                  ) : null
                ) : null
              }
            />
          </div>
          {!showInference && !incomeResult && (
            <InfoPanel userPreferences={userPreferences} />
          )}
          {incomeResult && <ResultPanel userPreferences={userPreferences} />}
        </>
      )}

      {/* Inference Dialog */}
      <InferenceDialog
        isOpen={showInferenceDialog}
        onClose={() => setShowInferenceDialog(false)}
        userMessage={messages[0]?.content}
      />
    </div>
  );
};

export default SmartRecommendPage;
