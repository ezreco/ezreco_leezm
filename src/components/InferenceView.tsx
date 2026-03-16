import React, { useState, useEffect, useRef } from "react";
import InferenceProgressCard from "./InferenceProgressCard";
import UsagePatternCard from "./UsagePatternCard";
import SpecFilterCard from "./SpecFilterCard";
import TechSpecListCard from "./TechSpecListCard";
import WeightAnalysisCard from "./WeightAnalysisCard";
import WeightListCard from "./WeightListCard";
import PieChartCard from "./PieChartCard";
import UserPreferenceCard from "./UserPreferenceCard";
import InferenceLoadingAnimation from "./InferenceLoadingAnimation";
import InferenceChatCard from "./InferenceChatCard";
import DonutChart from "./DonutChart";
import TagCloud from "./TagCloud";
import ConditionTagsCard from "./ConditionTagsCard";
import WeightPercentageCard from "./WeightPercentageCard";
import ButtonTextIcon from "./ButtonTextIcon";
import { inferenceStore } from "../store/inferenceStore";

interface InferenceViewProps {
  onComplete?: () => void;
  onHide?: () => void;
  userMessage?: string;
}

interface CardPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  bottom?: number; // Optional bottom anchor for cards that should be positioned from bottom
}

const InferenceView: React.FC<InferenceViewProps> = ({
  onComplete,
  onHide,
  userMessage,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationStage, setAnimationStage] = useState(0);
  const [arrowProgress, setArrowProgress] = useState(0);
  const [connectionLineProgress, setConnectionLineProgress] = useState(0);
  const [cardFadeProgress, setCardFadeProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const [progress5TitleSlide, setProgress5TitleSlide] = useState(0);
  const [progress5SpinnerRotation, setProgress5SpinnerRotation] = useState(0);
  const [data] = useState(() => inferenceStore.getData());
  const [pieChartData] = useState(data.step2?.pieChart || []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);
  const [chatCardHeight, setChatCardHeight] = useState(60); // Default height

  // Keep onCompleteRef in sync
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Measure chat card height when it's rendered
  useEffect(() => {
    if (chatCardRef.current && animationStage >= 1) {
      const height = chatCardRef.current.offsetHeight;
      if (height !== chatCardHeight) {
        setChatCardHeight(height);
      }
    }
  }, [animationStage, chatCardHeight]);

  useEffect(() => {
    // Animation sequence
    const sequence = [
      { stage: 1, delay: 1000 }, // Fade in loading + chat card
      { stage: 2, delay: 500 }, // Start drawing arrow
      { stage: 3, delay: 1000 }, // Show progress cards (1, 2)
      { stage: 4, delay: 2000 }, // Slide up titles
      { stage: 5, delay: 1000 }, // Transform progress1 to chart AND progress2 to tag cloud
      { stage: 6, delay: 1000 }, // Draw connection lines from top to bottom
      { stage: 7, delay: 1000 }, // Fade in progress3 & 4 cards
      { stage: 8, delay: 1000 }, // Transform progress3 & 4 to tag lists
      { stage: 9, delay: 1000 }, // Fade in progress5 card (loading with title)
      { stage: 10, delay: 2000 }, // Slide title down and out
      { stage: 11, delay: 1500 }, // New title slides up from bottom
      { stage: 12, delay: 2000 }, // Hide title area, show weight analysis
      { stage: 13, delay: 1000 }, // Fade in progress 6,7,8 card
      { stage: 14, delay: 2000 }, // Hide progress 6,7,8 title
    ];

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const runSequence = () => {
      if (currentIndex >= sequence.length) {
        setCurrentStep(1);
        // Auto-close after 1 second when all sequences are complete
        setTimeout(() => {
          console.log(
            "Auto-closing InferenceView, onCompleteRef.current:",
            onCompleteRef.current
          );
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }, 1000);
        return;
      }

      timeoutId = setTimeout(() => {
        setAnimationStage(sequence[currentIndex].stage);

        if (sequence[currentIndex].stage === 2) {
          // Animate arrow with requestAnimationFrame for smooth animation
          const startTime = performance.now();
          const duration = 1000; // 1 second

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            setArrowProgress(easeOutCubic);

            if (progress < 1) {
              animationFrameRef.current = requestAnimationFrame(animate);
            }
          };

          animationFrameRef.current = requestAnimationFrame(animate);
        }

        if (sequence[currentIndex].stage === 6) {
          // Animate connection lines from top to bottom
          const startTime = performance.now();
          const duration = 800; // 0.8 seconds

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            setConnectionLineProgress(easeOutCubic);

            if (progress < 1) {
              animationFrameRef.current = requestAnimationFrame(animate);
            }
          };

          animationFrameRef.current = requestAnimationFrame(animate);
        }

        if (sequence[currentIndex].stage === 7) {
          // Animate card fade in
          const startTime = performance.now();
          const duration = 500; // 0.5 seconds

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            setCardFadeProgress(easeOutCubic);

            if (progress < 1) {
              animationFrameRef.current = requestAnimationFrame(animate);
            }
          };

          animationFrameRef.current = requestAnimationFrame(animate);
        }

        if (sequence[currentIndex].stage === 10) {
          // Animate progress5 title slide down
          const startTime = performance.now();
          const duration = 500; // 0.5 seconds

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeInCubic = Math.pow(progress, 3);
            setProgress5TitleSlide(easeInCubic); // 0 to 1 (sliding down)

            if (progress < 1) {
              animationFrameRef.current = requestAnimationFrame(animate);
            }
          };

          animationFrameRef.current = requestAnimationFrame(animate);
        }

        if (sequence[currentIndex].stage === 11) {
          // Reset and animate new title slide up
          setProgress5TitleSlide(-1); // Start from below
          const startTime = performance.now();
          const duration = 500; // 0.5 seconds

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            setProgress5TitleSlide(-1 + easeOutCubic); // -1 to 0 (sliding up)

            if (progress < 1) {
              animationFrameRef.current = requestAnimationFrame(animate);
            }
          };

          animationFrameRef.current = requestAnimationFrame(animate);
        }

        currentIndex++;
        runSequence();
      }, sequence[currentIndex].delay);
    };

    runSequence();

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Progress5 spinner rotation animation
  useEffect(() => {
    if (animationStage >= 9 && animationStage < 11) {
      const interval = setInterval(() => {
        setProgress5SpinnerRotation((prev) => (prev + 30) % 360);
      }, 1000 / 12); // 12 fps, same as progress1 and progress2

      return () => clearInterval(interval);
    }
  }, [animationStage]);

  useEffect(() => {
    // Commented out for now - only show step 1
    // const steps = inferenceStore.getStepSequence();
    // let currentStepIndex = 1; // Start from index 1 (step 2)
    // const runSteps = () => {
    //   if (currentStepIndex >= steps.length) {
    //     onComplete?.();
    //     return;
    //   }
    //   const step = steps[currentStepIndex];
    //   setTimeout(() => {
    //     setCurrentStep(step.step);
    //     // Update pie chart for step 3
    //     if (step.step === 3) {
    //       inferenceStore.updatePieChartForStep3();
    //       setPieChartData(inferenceStore.getData().step2?.pieChart || []);
    //     }
    //     currentStepIndex++;
    //     runSteps();
    //   }, step.delay);
    // };
    // // Start the sequence after initial display
    // setTimeout(() => {
    //   runSteps();
    // }, steps[0].delay); // Use the first step's delay
  }, [onComplete]);

  // Define card positions for the inference layout (percentage-based)
  const getCardPositions = (
    containerWidth: number,
    containerHeight: number,
    chatHeight: number = 60
  ): Record<string, CardPosition> => {
    // Calculate positions with consistent gaps
    const chatCardGap = 20; // Gap between cards (adjust as needed)
    const chatCardCenterY = 348; // Center Y position for chat card

    // Calculate progress1 bottom position (above chat card)
    const progress1Height = 204;
    const progress1BottomY = chatCardCenterY - chatHeight / 2 - chatCardGap;

    // Calculate progress2 top position (below chat card)
    const progress2TopY = chatCardCenterY + chatHeight / 2 + chatCardGap;

    return {
      loadingSpinner: {
        x: 38,
        y: progress2TopY + 70 - 65, // Center Y aligned with progress2 (progress2 center: progress2TopY + 70, spinner height/2: 50)
        width: 100,
        height: 100,
      },
      // Step 1 cards
      progress1: {
        x: 1213, // 1640 - 352 - 75
        y: progress1BottomY - progress1Height,
        bottom: containerHeight - progress1BottomY, // Fixed bottom anchor point
        width: 352,
        height: progress1Height,
      },
      chatCardBetween: {
        x: 1390,
        y: chatCardCenterY,
        width: 450,
        height: chatHeight,
      },
      progress2: {
        x: 1640 - 320 - 75 - 16, // Center align (320 is card width)
        y: progress2TopY,
        width: 320,
        height: 140,
      },
      progress3: {
        x: 1640 - 320 - 75 - 16, // Right align (320 is card width)
        y: progress2TopY + 140 + 16 + 10, // Below progress2 with 16px gap + 10px
        width: 320,
        height: 100,
      },
      progress4: {
        x: 1640 - 320 - 75 - 16, // Right align (320 is card width)
        y: progress2TopY + 140 + 16 + 100 + 16 + 10, // Below progress3 with 16px gap + 10px
        width: 320,
        height: 100,
      },
      progress5: {
        x: 1640 - 320 - 75 - 16 - 492 - 80, // Left of progress3 with 16px gap
        y: progress2TopY + 100 + 10, // Aligned relative to progress2 + 10px
        width: 492,
        height: 330, // 296 + 34 (title height)
      },
      progress6: {
        x: 1640 - 320 - 75 - 16 - 492 - 80 - 274 - 80, // Left of progress5 with 80px gap
        y: progress2TopY + 100 + (330 - 252) / 2 - 20 + 10, // Center aligned with progress5 + 10px
        width: 274,
        height: 252 + 34,
      },
      progress7: {
        x: 1640 - 320 - 75 - 16 - 492 - 80 - 274 - 80 + 274 / 2 - 214 / 2, // Center aligned with progress6
        y: progress2TopY + 20, // Center aligned with progress2 (progress2 center: progress2TopY + 70, progress7 center offset: -50)
        width: 214,
        height: 66 + 34,
      },
      progress8: {
        x: 1640 - 320 - 75 - 16 - 492 - 80 - 274 - 80, // Same left as progress6
        y: progress1BottomY - 130, // Center aligned with progress1 (progress1 center: progress1BottomY - 102, progress8 center offset: -55)
        width: 584,
        height: 76 + 34,
      },

      chatCard: {
        x: containerWidth * 0.35,
        y: containerHeight * 0.35,
        width: 450,
        height: 60,
      },

      // Step 2 cards (left side)
      usagePattern: {
        x: containerWidth * 0.18,
        y: containerHeight * 0.11,
        width: 350,
        height: 80,
      },
      specFilter: {
        x: containerWidth * 0.2,
        y: containerHeight * 0.27,
        width: 214,
        height: 66,
      },
      techSpec: {
        x: containerWidth * 0.18,
        y: containerHeight * 0.36,
        width: 350,
        height: 180,
      },
      weightAnalysis: {
        x: containerWidth * 0.3,
        y: containerHeight * 0.58,
        width: 492,
        height: 296,
      },

      // Step 2 cards (right side)
      pieChart: {
        x: containerWidth * 0.72,
        y: containerHeight * 0.09,
        width: 352,
        height: 170,
      },
      userPref1: {
        x: containerWidth * 0.72,
        y: containerHeight * 0.33,
        width: 320,
        height: 66,
      },
      userPref2: {
        x: containerWidth * 0.72,
        y: containerHeight * 0.43,
        width: 320,
        height: 66,
      },
      userPref3: {
        x: containerWidth * 0.72,
        y: containerHeight * 0.53,
        width: 320,
        height: 66,
      },
    };
  };

  // Draw connection lines
  useEffect(() => {
    const drawConnections = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Enable high DPI rendering for crisp lines
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      // Set canvas size accounting for device pixel ratio
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Scale context to match device pixel ratio
      ctx.scale(dpr, dpr);

      // Disable image smoothing for crisp 1px lines
      ctx.imageSmoothingEnabled = false;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const containerWidth = 1640;
      const containerHeight = 900;
      const positions = getCardPositions(
        containerWidth,
        containerHeight,
        chatCardHeight
      );

      // Set line style
      ctx.strokeStyle = "#0106FF";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Step 1: Draw bidirectional arrow between progress1 and progress2
      if (animationStage >= 2 && positions.chatCardBetween) {
        const chatCard = positions.chatCardBetween;
        const progress1 = positions.progress1;
        const progress2 = positions.progress2;

        if (progress1) {
          // Calculate positions
          const chatCenterX = chatCard.x;
          const chatCenterY = chatCard.y;

          const progress1CenterX = progress1.x + progress1.width / 2;
          // Use bottom anchor to calculate actual bottom position
          const progress1ActualBottom =
            containerHeight - (progress1.bottom || 0) + 2; // 2px gap from card

          const progress2CenterX = progress2.x + progress2.width / 2;
          const progress2Top = progress2.y - 2; // 2px gap from card

          // Calculate total line length (now progress1 is above chat card)
          const distanceToProgress1 = Math.abs(
            chatCenterY - progress1ActualBottom
          );
          const distanceToProgress2 = progress2Top - chatCenterY;
          const totalLength = distanceToProgress1 + distanceToProgress2;
          const currentLength = totalLength * arrowProgress;

          // Draw line from chat card center
          ctx.beginPath();
          ctx.moveTo(chatCenterX, chatCenterY);

          if (currentLength <= distanceToProgress1) {
            // Drawing upward to progress1 bottom
            const currentY = chatCenterY - currentLength;
            ctx.lineTo(progress1CenterX, currentY);
          } else {
            // Draw full line to progress1 bottom
            ctx.lineTo(progress1CenterX, progress1ActualBottom);
            // Draw line downward to progress2 top
            const remainingLength = currentLength - distanceToProgress1;
            const currentY = chatCenterY + remainingLength;
            ctx.moveTo(chatCenterX, chatCenterY);
            ctx.lineTo(progress2CenterX, Math.min(currentY, progress2Top));
          }

          ctx.stroke();

          // Draw arrowheads progressively
          const arrowLength = 4;
          const arrowWidth = 4;

          // Progress1 arrowhead (appears when line reaches 50% of upward distance)
          // Arrow points upward (into progress1 from bottom)
          const progress1Threshold = 0.5;
          if (currentLength >= distanceToProgress1 * progress1Threshold) {
            const progress1ArrowProgress = Math.min(
              (currentLength - distanceToProgress1 * progress1Threshold) /
                (distanceToProgress1 * (1 - progress1Threshold)),
              1
            );
            const currentArrowLength = arrowLength * progress1ArrowProgress;

            ctx.beginPath();
            ctx.moveTo(progress1CenterX, progress1ActualBottom);
            ctx.lineTo(
              progress1CenterX - arrowWidth,
              progress1ActualBottom + currentArrowLength
            );
            ctx.moveTo(progress1CenterX, progress1ActualBottom);
            ctx.lineTo(
              progress1CenterX + arrowWidth,
              progress1ActualBottom + currentArrowLength
            );
            ctx.stroke();
          }

          // Progress2 arrowhead (appears when line starts going down)
          // Arrow points downward (into progress2 from top)
          if (currentLength > distanceToProgress1) {
            const progress2ArrowProgress = Math.min(
              (currentLength - distanceToProgress1) / distanceToProgress2,
              1
            );
            const currentArrowLength = arrowLength * progress2ArrowProgress;

            ctx.beginPath();
            ctx.moveTo(progress2CenterX, progress2Top);
            ctx.lineTo(
              progress2CenterX - arrowWidth,
              progress2Top - currentArrowLength
            );
            ctx.moveTo(progress2CenterX, progress2Top);
            ctx.lineTo(
              progress2CenterX + arrowWidth,
              progress2Top - currentArrowLength
            );
            ctx.stroke();
          }
        }
      }

      // Step 1.5: Draw line from progress2 to progress3/4 with animation
      if (animationStage >= 6 && positions.progress2 && positions.progress3) {
        const progress2 = positions.progress2;
        const progress3 = positions.progress3;

        // Start point: right side of progress2, middle height (adjusted for title height)
        const titleHeight = 34;
        const startX = progress2.x + progress2.width;
        const startY = progress2.y + progress2.height / 2 - titleHeight + 17;

        // End point: right side of progress3, middle height (with 2px gap, adjusted for title height)
        const endX = progress3.x + progress3.width + 2;
        const endY = progress3.y + progress3.height / 2 - titleHeight + 17;

        // Arrow dimensions
        const arrowLength = 6;
        const arrowWidth = 4;

        // Intermediate points
        const horizontalExtension = 40; // Extend 40px to the right
        const midX = startX + horizontalExtension;

        // Control points for rounded corners
        const cornerRadius = 12;

        ctx.strokeStyle = "#0106FF";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Calculate path segments and total length
        const segment1Length = horizontalExtension; // Horizontal right
        const segment2Length = Math.abs(endY - startY); // Vertical down
        const segment3Length = Math.abs(endX - midX); // Horizontal left
        const totalLength = segment1Length + segment2Length + segment3Length;
        const currentLength = totalLength * connectionLineProgress;

        // Draw progressive path
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        if (currentLength <= segment1Length) {
          // Drawing first horizontal segment
          const currentX = startX + currentLength;
          ctx.lineTo(currentX, startY);
        } else if (currentLength <= segment1Length + segment2Length) {
          // Draw full horizontal segment + partial vertical
          ctx.lineTo(midX - cornerRadius, startY);
          ctx.arcTo(midX, startY, midX, endY, cornerRadius);

          const verticalProgress = currentLength - segment1Length;
          const currentY = startY + verticalProgress;
          ctx.lineTo(midX, Math.min(currentY, endY - cornerRadius));
        } else {
          // Draw full horizontal and vertical, partial final horizontal
          ctx.lineTo(midX - cornerRadius, startY);
          ctx.arcTo(midX, startY, midX, endY, cornerRadius);
          ctx.lineTo(midX, endY - cornerRadius);
          ctx.arcTo(midX, endY, endX, endY, cornerRadius);

          const horizontalProgress =
            currentLength - segment1Length - segment2Length;
          const currentX = midX + horizontalProgress;
          ctx.lineTo(Math.min(currentX, endX), endY);
        }

        ctx.stroke();

        // Draw arrow only when line is complete
        if (connectionLineProgress >= 0.9) {
          const arrowAlpha = (connectionLineProgress - 0.9) / 0.1;
          ctx.globalAlpha = arrowAlpha;
          ctx.beginPath();
          ctx.moveTo(endX + arrowLength, endY - arrowWidth);
          ctx.lineTo(endX, endY);
          ctx.lineTo(endX + arrowLength, endY + arrowWidth);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // Step 1.6: Draw line from progress2 to progress4 with animation
      if (animationStage >= 6 && positions.progress2 && positions.progress4) {
        const progress2 = positions.progress2;
        const progress4 = positions.progress4;

        // Start point: right side of progress2, middle height (adjusted for title height)
        const titleHeight = 34;
        const startX = progress2.x + progress2.width;
        const startY = progress2.y + progress2.height / 2 - titleHeight + 17;

        // End point: right side of progress4, middle height (with 2px gap, adjusted for title height)
        const endX = progress4.x + progress4.width + 2;
        const endY = progress4.y + progress4.height / 2 - titleHeight + 17;

        // Arrow dimensions
        const arrowLength = 6;
        const arrowWidth = 4;

        // Intermediate points
        const horizontalExtension = 40; // Extend 40px to the right
        const midX = startX + horizontalExtension;

        // Control points for rounded corners
        const cornerRadius = 12;

        ctx.strokeStyle = "#0106FF";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Calculate path segments and total length
        const segment1Length = horizontalExtension; // Horizontal right
        const segment2Length = Math.abs(endY - startY); // Vertical down
        const segment3Length = Math.abs(endX - midX); // Horizontal left
        const totalLength = segment1Length + segment2Length + segment3Length;
        const currentLength = totalLength * connectionLineProgress;

        // Draw progressive path
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        if (currentLength <= segment1Length) {
          // Drawing first horizontal segment
          const currentX = startX + currentLength;
          ctx.lineTo(currentX, startY);
        } else if (currentLength <= segment1Length + segment2Length) {
          // Draw full horizontal segment + partial vertical
          ctx.lineTo(midX - cornerRadius, startY);
          ctx.arcTo(midX, startY, midX, endY, cornerRadius);

          const verticalProgress = currentLength - segment1Length;
          const currentY = startY + verticalProgress;
          ctx.lineTo(midX, Math.min(currentY, endY - cornerRadius));
        } else {
          // Draw full horizontal and vertical, partial final horizontal
          ctx.lineTo(midX - cornerRadius, startY);
          ctx.arcTo(midX, startY, midX, endY, cornerRadius);
          ctx.lineTo(midX, endY - cornerRadius);
          ctx.arcTo(midX, endY, endX, endY, cornerRadius);

          const horizontalProgress =
            currentLength - segment1Length - segment2Length;
          const currentX = midX + horizontalProgress;
          ctx.lineTo(Math.min(currentX, endX), endY);
        }

        ctx.stroke();

        // Draw arrow only when line is complete
        if (connectionLineProgress >= 0.9) {
          const arrowAlpha = (connectionLineProgress - 0.9) / 0.1;
          ctx.globalAlpha = arrowAlpha;
          ctx.beginPath();
          ctx.moveTo(endX + arrowLength, endY - arrowWidth);
          ctx.lineTo(endX, endY);
          ctx.lineTo(endX + arrowLength, endY + arrowWidth);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // Step 1.6.1: Draw line from progress1 through progress8 to loadingSpinner
      if (
        animationStage >= 13 &&
        positions.progress1 &&
        positions.progress8 &&
        positions.loadingSpinner
      ) {
        const progress1 = positions.progress1;
        const progress8 = positions.progress8;
        const spinner = positions.loadingSpinner;

        const titleHeight = 34;
        const arrowLength = 6;
        const arrowWidth = 4;
        const cornerRadius = 12;

        // Start: bottom of progress1
        const startX = progress1.x + progress1.width / 2;
        const startY = containerHeight - (progress1.bottom || 0);

        // Pass through: left side of progress8 (center Y)
        const passThroughX = progress8.x - 2;
        const passThroughY =
          progress8.y + progress8.height / 2 - titleHeight + 17;

        // Turn point: above spinner
        const turnX = spinner.x + spinner.width / 2;

        // End: 20px above spinner top
        const endX = spinner.x + spinner.width / 2;
        const endY = spinner.y - 20;

        ctx.strokeStyle = "#0106FF";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Draw complete path
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX, passThroughY);
        ctx.lineTo(passThroughX, passThroughY);
        ctx.lineTo(turnX + cornerRadius, passThroughY);
        ctx.arcTo(turnX, passThroughY, turnX, endY, cornerRadius);
        ctx.lineTo(turnX, endY);
        ctx.stroke();

        // Arrow at spinner (pointing down toward spinner)
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowWidth, endY - arrowLength);
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX + arrowWidth, endY - arrowLength);
        ctx.stroke();
      }

      // Step 1.6.2: Draw line from progress2 through progress7 to loadingSpinner
      if (
        animationStage >= 13 &&
        positions.progress2 &&
        positions.progress7 &&
        positions.loadingSpinner
      ) {
        const progress2 = positions.progress2;
        const progress7 = positions.progress7;
        const spinner = positions.loadingSpinner;

        const titleHeight = 34;
        const arrowLength = 4;
        const arrowWidth = 4;

        // Start: right side of progress2 (center Y)
        const startX = progress2.x + progress2.width + 2;
        const startY = progress2.y + progress2.height / 2 - titleHeight + 17;

        // Pass through left: left side of progress7 (center Y)
        const passThroughLeftX = progress7.x - 2;
        const passThroughY =
          progress7.y + progress7.height / 2 - titleHeight + 17;

        // Pass through right: right side of progress7 (center Y)
        const passThroughRightX = progress7.x + progress7.width + 2;

        // End: left edge of spinner at passThroughY level
        const endX = spinner.x + spinner.width + 20;

        ctx.strokeStyle = "#0106FF";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Draw complete path: progress2 -> progress7 left -> progress7 right -> spinner (horizontal)
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(passThroughLeftX, startY);
        ctx.lineTo(passThroughLeftX, passThroughY);
        ctx.lineTo(passThroughRightX, passThroughY);
        ctx.lineTo(endX, passThroughY);
        ctx.stroke();

        // Arrow at end of horizontal line (pointing left toward spinner)
        ctx.beginPath();
        ctx.moveTo(endX, passThroughY);
        ctx.lineTo(endX + arrowLength, passThroughY - arrowWidth);
        ctx.moveTo(endX, passThroughY);
        ctx.lineTo(endX + arrowLength, passThroughY + arrowWidth);
        ctx.stroke();
      }

      // Step 1.7: Draw line from progress3 to progress5 with animation
      if (animationStage >= 9 && positions.progress3 && positions.progress5) {
        const progress3 = positions.progress3;
        const progress5 = positions.progress5;

        // Start point: left side of progress3, middle height (adjusted for title height)
        const titleHeight = 34;
        const startX = progress3.x - 2; // 2px gap from card
        const startY = progress3.y + progress3.height / 2 - titleHeight + 17;

        // End point: right side of progress5, middle height (adjusted for title height)
        const endX = progress5.x + progress5.width + 2; // 2px gap from card
        const endY = progress5.y + progress5.height / 2 - titleHeight + 17;

        // Arrow dimensions
        const arrowLength = 6;
        const arrowWidth = 4;

        // Intermediate points
        const horizontalExtension = 40; // Extend 40px to the left
        const midX = startX - horizontalExtension;

        // Control points for rounded corners
        const cornerRadius = 12;

        ctx.strokeStyle = "#0106FF";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Draw ㄷ-shaped line with rounded corners (mirrored)
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        // Horizontal line to the left (stop before first corner)
        ctx.lineTo(midX + cornerRadius, startY);
        // First rounded corner (horizontal to vertical)
        ctx.arcTo(midX, startY, midX, endY, cornerRadius);

        // Vertical line (stop before second corner)
        ctx.lineTo(midX, endY + cornerRadius * Math.sign(startY - endY));
        // Second rounded corner (vertical to horizontal)
        ctx.arcTo(midX, endY, endX, endY, cornerRadius);

        // Horizontal line to progress5
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw leftward arrow at end point (pointing into progress5)
        ctx.beginPath();
        ctx.moveTo(endX + arrowLength, endY - arrowWidth);
        ctx.lineTo(endX, endY);
        ctx.lineTo(endX + arrowLength, endY + arrowWidth);
        ctx.stroke();
      }

      // Step 1.8: Draw line from progress4 to progress5 with animation
      if (animationStage >= 9 && positions.progress4 && positions.progress5) {
        const progress4 = positions.progress4;
        const progress5 = positions.progress5;

        // Start point: left side of progress4, middle height (adjusted for title height)
        const titleHeight = 34;
        const startX = progress4.x - 2; // 2px gap from card
        const startY = progress4.y + progress4.height / 2 - titleHeight + 17;

        // End point: right side of progress5, middle height (adjusted for title height)
        const endX = progress5.x + progress5.width + 2; // 2px gap from card
        const endY = progress5.y + progress5.height / 2 - titleHeight + 17;

        // Arrow dimensions
        const arrowLength = 6;
        const arrowWidth = 4;

        // Intermediate points
        const horizontalExtension = 40; // Extend 40px to the left
        const midX = startX - horizontalExtension;

        // Control points for rounded corners
        const cornerRadius = 12;

        ctx.strokeStyle = "#0106FF";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Draw ㄷ-shaped line with rounded corners (mirrored)
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        // Horizontal line to the left (stop before first corner)
        ctx.lineTo(midX + cornerRadius, startY);
        // First rounded corner (horizontal to vertical)
        ctx.arcTo(midX, startY, midX, endY, cornerRadius);

        // Vertical line (stop before second corner)
        ctx.lineTo(midX, endY + cornerRadius * Math.sign(startY - endY));
        // Second rounded corner (vertical to horizontal)
        ctx.arcTo(midX, endY, endX, endY, cornerRadius);

        // Horizontal line to progress5
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw leftward arrow at end point (pointing into progress5)
        ctx.beginPath();
        ctx.moveTo(endX + arrowLength, endY - arrowWidth);
        ctx.lineTo(endX, endY);
        ctx.lineTo(endX + arrowLength, endY + arrowWidth);
        ctx.stroke();
      }

      // Step 1.8: Draw line from progress5 through progress6 to loadingSpinner
      if (
        animationStage >= 13 &&
        positions.progress5 &&
        positions.progress6 &&
        positions.loadingSpinner
      ) {
        const progress5 = positions.progress5;
        const progress6 = positions.progress6;
        const spinner = positions.loadingSpinner;

        const titleHeight = 34;
        const arrowLength = 6;
        const arrowWidth = 4;
        const cornerRadius = 12;

        // Start: left of progress5
        const startX = progress5.x - 2;
        const startY = progress5.y + progress5.height / 2 - titleHeight + 17;

        // Pass through: left side of progress6 (center Y)
        const passThroughY =
          progress6.y + progress6.height / 2 - titleHeight + 17;

        // Turn point: below spinner
        const turnX = spinner.x + spinner.width / 2;

        // End: 20px below spinner bottom
        const endX = spinner.x + spinner.width / 2;
        const endY = spinner.y + spinner.height + 20;

        ctx.strokeStyle = "#0106FF";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Draw complete path
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        // ctx.lineTo(passThroughX, startY);
        // ctx.lineTo(passThroughX, passThroughY);
        ctx.lineTo(turnX + cornerRadius, passThroughY);
        ctx.arcTo(turnX, passThroughY, turnX, endY, cornerRadius);
        ctx.lineTo(turnX, endY);
        ctx.stroke();

        // Arrow at spinner (pointing up toward spinner)
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowWidth, endY + arrowLength);
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX + arrowWidth, endY + arrowLength);
        ctx.stroke();
      }

      // Step 2+: Draw connections from left cards to right cards
      if (currentStep >= 2) {
        const drawConnection = (
          fromKey: string,
          toKey: string,
          curved: boolean = false
        ) => {
          const from = positions[fromKey];
          const to = positions[toKey];

          if (!from || !to) return;

          const startX = from.x + from.width;
          const startY = from.y + from.height / 2;
          const endX = to.x;
          const endY = to.y + to.height / 2;

          ctx.beginPath();
          ctx.moveTo(startX, startY);

          if (curved && Math.abs(endY - startY) > 20) {
            // Curved connection
            const midX = startX + (endX - startX) / 2;
            const cornerRadius = 12;

            ctx.lineTo(midX - cornerRadius, startY);
            ctx.quadraticCurveTo(
              midX,
              startY,
              midX,
              startY + Math.sign(endY - startY) * cornerRadius
            );
            ctx.lineTo(midX, endY - Math.sign(endY - startY) * cornerRadius);
            ctx.quadraticCurveTo(midX, endY, midX + cornerRadius, endY);
            ctx.lineTo(endX, endY);
          } else {
            // Straight line
            ctx.lineTo(endX, endY);
          }

          ctx.stroke();

          // Arrow head
          const arrowLength = 10;
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - arrowLength, endY - 4);
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - arrowLength, endY + 4);
          ctx.stroke();
        };

        // Draw connections based on Figma design
        drawConnection("usagePattern", "pieChart", true);
        drawConnection("specFilter", "userPref1", true);
        drawConnection("techSpec", "userPref2", true);
        drawConnection("weightAnalysis", "userPref3", true);
      }
    };

    drawConnections();
  }, [
    currentStep,
    pieChartData,
    animationStage,
    arrowProgress,
    connectionLineProgress,
    cardFadeProgress,
    chatCardHeight,
  ]);

  // Fixed container dimensions
  const containerWidth = 1640;
  const containerHeight = 900;

  const positions = getCardPositions(
    containerWidth,
    containerHeight,
    chatCardHeight
  );

  // Chart data from store
  const chartData =
    data.step2?.pieChart.map((item) => ({
      value: item.percentage,
      label: item.label,
    })) || [];

  return (
    <div className="w-full h-full flex  justify-center  overflow-auto">
      {/* Toggle button for hiding/showing recommendation process */}
      <div className="absolute top-[160px] left-[32px] z-10">
        <ButtonTextIcon onClick={onHide} />
      </div>
      <div ref={containerRef} className="relative w-[1640px] h-[900px]">
        {/* Canvas for connection lines */}
        <canvas
          ref={canvasRef}
          width={containerWidth}
          height={containerHeight}
          className="absolute top-0 left-0 pointer-events-none"
        />

        <div
          className="absolute transition-opacity duration-500"
          style={{
            left: `${positions.loadingSpinner.x}px`,
            top: `${positions.loadingSpinner.y}px`,
            opacity: animationStage >= 1 ? 1 : 0,
          }}
        >
          <InferenceLoadingAnimation
            size={100}
            fps={30}
            loop={true}
            showText={false}
          />
        </div>
        {/* Step 1: Initial loading with progress cards */}
        {animationStage >= 1 && (
          <>
            {/* Progress Cards - Center aligned */}
            {data.step1 && positions.progress1 && (
              <>
                <div
                  className="absolute transition-opacity duration-500"
                  style={{
                    left: `${positions.progress1.x}px`,
                    bottom: `${positions.progress1.bottom}px`,
                    opacity: animationStage >= 3 ? 1 : 0,
                  }}
                >
                  <InferenceProgressCard
                    text={data.step1.progress1}
                    loading={animationStage < 5}
                    width={positions.progress1.width}
                    height={positions.progress1.height}
                    showTitle={animationStage >= 4 && animationStage < 5}
                  >
                    {animationStage >= 5 && (
                      <DonutChart
                        segments={chartData}
                        width={positions.progress1.width - 30}
                        height={170}
                      />
                    )}
                  </InferenceProgressCard>
                </div>

                {/* Chat Card Between Progress Cards */}
                {positions.chatCardBetween && (
                  <div
                    ref={chatCardRef}
                    className="absolute transition-opacity duration-500"
                    style={{
                      left: `${positions.chatCardBetween.x}px`,
                      top: `${positions.chatCardBetween.y}px`,
                      minWidth: "200px",
                      maxWidth: "600px",
                      transform: "translate(-50%, -50%)",
                      opacity: animationStage >= 1 ? 1 : 0,
                    }}
                  >
                    <InferenceChatCard
                      text={
                        userMessage ||
                        "삼성과 엘지 브랜드 65인치 4K TV중에서 거실에서 영화를 주로 보긴 하는데&#10;가끔 스포츠도 보기에 적합한 모델 추천해줘"
                      }
                    />
                  </div>
                )}

                <div
                  className="absolute transition-opacity duration-500"
                  style={{
                    left: `${positions.progress2.x}px`,
                    top: `${positions.progress2.y}px`,
                    opacity: animationStage >= 3 ? 1 : 0,
                  }}
                >
                  {animationStage < 5 ? (
                    <InferenceProgressCard
                      text={data.step1.progress2}
                      loading={true}
                      width={positions.progress2.width}
                      height={positions.progress2.height}
                      showTitle={animationStage >= 4 && animationStage < 5}
                    />
                  ) : (
                    <InferenceProgressCard
                      text={data.step1.progress2}
                      loading={false}
                      width={positions.progress2.width}
                      height={positions.progress2.height}
                      showTitle={false}
                    >
                      <TagCloud
                        tags={data.step2?.userPreferences || []}
                        width={positions.progress2.width}
                        height={positions.progress2.height}
                      />
                    </InferenceProgressCard>
                  )}
                </div>

                {/* Progress3 Card */}
                {positions.progress3 && data.step1?.progress3 && (
                  <div
                    className="absolute"
                    style={{
                      left: `${positions.progress3.x}px`,
                      top: `${positions.progress3.y}px`,
                      opacity: animationStage >= 7 ? cardFadeProgress : 0,
                      transition: "none",
                    }}
                  >
                    {animationStage < 8 ? (
                      <InferenceProgressCard
                        text={data.step1.progress3}
                        loading={true}
                        width={positions.progress3.width}
                        height={positions.progress3.height}
                        showTitle={animationStage >= 7 && animationStage < 8}
                      />
                    ) : (
                      <InferenceProgressCard
                        text={data.step1.progress3}
                        loading={false}
                        width={positions.progress3.width}
                        height={positions.progress3.height}
                        showTitle={false}
                      >
                        <TagCloud
                          tags={data.step2?.environmentTags || []}
                          width={positions.progress3.width}
                          height={66}
                          layout="horizontal"
                        />
                      </InferenceProgressCard>
                    )}
                  </div>
                )}

                {/* Progress4 Card */}
                {positions.progress4 && data.step1?.progress4 && (
                  <div
                    className="absolute"
                    style={{
                      left: `${positions.progress4.x}px`,
                      top: `${positions.progress4.y}px`,
                      opacity: animationStage >= 7 ? cardFadeProgress : 0,
                      transition: "none",
                    }}
                  >
                    {animationStage < 8 ? (
                      <InferenceProgressCard
                        text={data.step1.progress4}
                        loading={true}
                        width={positions.progress4.width}
                        height={positions.progress4.height}
                        showTitle={animationStage >= 7 && animationStage < 8}
                      />
                    ) : (
                      <InferenceProgressCard
                        text={data.step1.progress4}
                        loading={false}
                        width={positions.progress4.width}
                        height={positions.progress4.height}
                        showTitle={false}
                      >
                        <TagCloud
                          tags={data.step2?.contextTags || []}
                          width={positions.progress4.width}
                          height={66}
                          layout="horizontal"
                        />
                      </InferenceProgressCard>
                    )}
                  </div>
                )}

                {/* Progress5 Card */}
                {positions.progress5 && data.step1?.progress5 && (
                  <div
                    className="absolute transition-opacity duration-500"
                    style={{
                      left: `${positions.progress5.x}px`,
                      top: `${
                        positions.progress5.y + positions.progress5.height / 2
                      }px`,
                      opacity: animationStage >= 9 ? 1 : 0,
                      transform: "translateY(-50%)",
                    }}
                  >
                    {animationStage < 12 ? (
                      <div
                        className="relative transition-all duration-300"
                        style={{
                          width: `${positions.progress5.width}px`,
                          height: `${positions.progress5.height}px`,
                        }}
                      >
                        {/* Gradient border wrapper */}
                        <div
                          className="rounded-[12px] h-full p-[1px]"
                          style={{
                            background:
                              "linear-gradient(117deg, var(--Effect-Gradient-Start, #7850FF) 0%, var(--Effect-Gradient-End, #37D7FF) 100%)",
                          }}
                        >
                          <div className="rounded-[12px] overflow-hidden bg-white h-full flex flex-col">
                            {/* Gradient title section - fixed */}
                            <div
                              className="w-full flex gap-[4px] items-center px-[18px] relative overflow-hidden"
                              style={{
                                height: "34px",
                                background:
                                  "linear-gradient(117deg, var(--Effect-Gradient-Start, #7850FF) 0%, var(--Effect-Gradient-End, #37D7FF) 100%)",
                              }}
                            >
                              {/* Content wrapper with slide animation */}
                              <div
                                className="flex gap-[4px] items-center absolute left-[18px]"
                                style={{
                                  transform: `translateY(${
                                    progress5TitleSlide * 50
                                  }px)`,
                                  transition: "none",
                                  opacity:
                                    progress5TitleSlide < -0.5 ||
                                    progress5TitleSlide > 0.5
                                      ? 0
                                      : 1,
                                }}
                              >
                                {animationStage < 11 && (
                                  <div
                                    className="relative shrink-0 size-[20px] transition-transform duration-[83ms] ease-linear"
                                    style={{
                                      transform: `rotate(${progress5SpinnerRotation}deg)`,
                                    }}
                                  >
                                    <svg
                                      className="w-full h-full"
                                      viewBox="0 0 17 17"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M8.5 16.002L8.5 13.002"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        opacity="0.8"
                                        d="M8.5 4L8.5 1"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M13.8047 13.8047L11.6822 11.6822"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        opacity="0.6"
                                        d="M5.32031 5.32031L3.19781 3.19781"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M16 8.5L13 8.5"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        opacity="0.4"
                                        d="M4 8.5L1 8.5"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M13.8047 3.19781L11.6822 5.32031"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        opacity="0.2"
                                        d="M5.32031 11.6822L3.19781 13.8047"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                )}
                                <p className="text-[16px] font-semibold leading-[26px] text-white whitespace-nowrap">
                                  {animationStage < 11
                                    ? data.step1.progress5
                                    : data.step1.progress5Title2}
                                </p>
                              </div>
                            </div>

                            {/* White body section */}
                            <div className="flex-1 bg-white flex items-center justify-center p-0">
                              <WeightAnalysisCard
                                bubbles={
                                  data.step2?.weightAnalysis.bubbles || []
                                }
                                disclaimer={
                                  data.step2?.weightAnalysis.disclaimer || ""
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <InferenceProgressCard
                        text={
                          data.step1.progress5Title2 || data.step1.progress5
                        }
                        loading={false}
                        width={positions.progress5.width}
                        height={positions.progress5.height}
                        showTitle={false}
                      >
                        <WeightAnalysisCard
                          bubbles={data.step2?.weightAnalysis.bubbles || []}
                          disclaimer={
                            data.step2?.weightAnalysis.disclaimer || ""
                          }
                        />
                      </InferenceProgressCard>
                    )}
                  </div>
                )}

                {/* Progress6 Card */}
                {positions.progress6 && data.step1?.progress6 && (
                  <div
                    className="absolute transition-opacity duration-500"
                    style={{
                      left: `${positions.progress6.x}px`,
                      top: `${positions.progress6.y}px`,
                      opacity: animationStage >= 13 ? 1 : 0,
                    }}
                  >
                    <InferenceProgressCard
                      text={data.step1.progress6}
                      loading={false}
                      width={positions.progress6.width}
                      height={positions.progress6.height}
                      showTitle={animationStage >= 13 && animationStage < 14}
                    >
                      <WeightListCard items={data.step2?.weightList || []} />
                    </InferenceProgressCard>
                  </div>
                )}

                {/* Progress7 Card */}
                {positions.progress7 && (
                  <div
                    className="absolute transition-opacity duration-500"
                    style={{
                      left: `${positions.progress7.x}px`,
                      top: `${positions.progress7.y}px`,
                      opacity: animationStage >= 13 ? 1 : 0,
                    }}
                  >
                    <InferenceProgressCard
                      text="선택한 조건이 반영되었어요"
                      loading={false}
                      width={positions.progress7.width}
                      height={positions.progress7.height}
                      showTitle={animationStage >= 13 && animationStage < 14}
                    >
                      <ConditionTagsCard tags={["삼성", "엘지", "65인치"]} />
                    </InferenceProgressCard>
                  </div>
                )}

                {/* Progress8 Card */}
                {positions.progress8 && (
                  <div
                    className="absolute transition-opacity duration-500"
                    style={{
                      left: `${positions.progress8.x}px`,
                      top: `${positions.progress8.y}px`,
                      opacity: animationStage >= 13 ? 1 : 0,
                    }}
                  >
                    <InferenceProgressCard
                      text="전문가 의견에 따른 중요도가 반영되었어요"
                      loading={false}
                      width={positions.progress8.width}
                      height={positions.progress8.height}
                      showTitle={animationStage >= 13 && animationStage < 14}
                    >
                      <WeightPercentageCard
                        items={chartData.map((item) => ({
                          percentage: item.value,
                          label: item.label,
                        }))}
                      />
                    </InferenceProgressCard>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Step 2: Detailed analysis cards */}
        {currentStep >= 2 &&
          data.step2 &&
          positions.usagePattern &&
          positions.pieChart && (
            <>
              {/* Left side cards */}
              {positions.usagePattern && (
                <div
                  className="absolute"
                  style={{
                    left: `${positions.usagePattern.x}px`,
                    top: `${positions.usagePattern.y}px`,
                  }}
                >
                  <UsagePatternCard patterns={data.step2.usagePattern} />
                </div>
              )}

              {positions.specFilter && (
                <div
                  className="absolute"
                  style={{
                    left: `${positions.specFilter.x}px`,
                    top: `${positions.specFilter.y}px`,
                  }}
                >
                  <SpecFilterCard specs={data.step2.specs} />
                </div>
              )}

              {positions.techSpec && (
                <div
                  className="absolute"
                  style={{
                    left: `${positions.techSpec.x}px`,
                    top: `${positions.techSpec.y}px`,
                  }}
                >
                  <TechSpecListCard specs={data.step2.techSpecs} />
                </div>
              )}

              {positions.weightAnalysis && (
                <div
                  className="absolute"
                  style={{
                    left: `${positions.weightAnalysis.x}px`,
                    top: `${positions.weightAnalysis.y}px`,
                  }}
                >
                  <WeightAnalysisCard
                    bubbles={data.step2.weightAnalysis.bubbles}
                    disclaimer={data.step2.weightAnalysis.disclaimer}
                  />
                </div>
              )}

              {/* Right side cards */}
              {positions.pieChart && (
                <div
                  className="absolute"
                  style={{
                    left: `${positions.pieChart.x}px`,
                    top: `${positions.pieChart.y}px`,
                  }}
                >
                  <PieChartCard segments={pieChartData} />
                </div>
              )}

              {positions.userPref1 && (
                <div
                  className="absolute"
                  style={{
                    left: `${positions.userPref1.x}px`,
                    top: `${positions.userPref1.y}px`,
                  }}
                >
                  <UserPreferenceCard
                    tags={data.step2.userPreferences.slice(0, 3)}
                  />
                </div>
              )}

              {positions.userPref2 && (
                <div
                  className="absolute"
                  style={{
                    left: `${positions.userPref2.x}px`,
                    top: `${positions.userPref2.y}px`,
                  }}
                >
                  <UserPreferenceCard
                    tags={data.step2.userPreferences.slice(3, 6)}
                  />
                </div>
              )}

              {positions.userPref3 && (
                <div
                  className="absolute"
                  style={{
                    left: `${positions.userPref3.x}px`,
                    top: `${positions.userPref3.y}px`,
                  }}
                >
                  <UserPreferenceCard
                    tags={data.step2.userPreferences.slice(6)}
                  />
                </div>
              )}
            </>
          )}

        {/* Step 4: Final completion - move loading to top left */}
        {currentStep >= 4 && positions.loadingSpinner && (
          <div
            className="absolute"
            style={{
              left: `${positions.loadingSpinner.x}px`,
              top: "100px",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default InferenceView;
