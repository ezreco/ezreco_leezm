import React, { useState } from "react";
import HistoryContextMenu from "./HistoryContextMenu";

interface HistoryItem {
  id: string;
  title: string;
  description?: string;
}

interface HistoryGroup {
  id: string;
  dateLabel: string;
  items: HistoryItem[];
}

interface HistoryListProps {
  groups?: HistoryGroup[];
  activeItemId?: string;
}

const HistoryList: React.FC<HistoryListProps> = ({
  groups = [
    {
      id: "today",
      dateLabel: "오늘",
      items: [
        { id: "1", title: "삼성 티비 추천해줘" },
        { id: "2", title: "집에서 보기 좋은 삼성 티비 추천..." },
      ],
    },
    {
      id: "yesterday",
      dateLabel: "어제",
      items: [
        { id: "1", title: "삼성 티비 추천해줘" },
        { id: "2", title: "집에서 보기 좋은 삼성 티비 추천..." },
      ],
    },
    {
      id: "week",
      dateLabel: "이전",
      items: [
        { id: "3", title: "삼성 티비 추천해줘" },
        { id: "4", title: "집에서 보기 좋은 삼성 티비 추천..." },
      ],
    },
  ],
}) => {
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    itemId: string;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    itemId: "",
  });

  const handleContextMenuClick = (event: React.MouseEvent, itemId: string) => {
    event.preventDefault();
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    setContextMenu({
      isOpen: true,
      x: rect.left, // Position menu at the button's X position
      y: rect.bottom + 4, // Position menu below the button with small gap
      itemId,
    });
  };

  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  };

  const handleMenuAction = (action: string, itemId: string) => {
    console.log(`Action: ${action} for item: ${itemId}`);
    // Handle menu actions here
    switch (action) {
      case "share":
        console.log("공유 클릭");
        break;
      case "pin":
        console.log("대화 고정 클릭");
        break;
      case "favorite":
        console.log("즐겨찾기 추가 클릭");
        break;
      case "rename":
        console.log("이름 바꾸기 클릭");
        break;
      case "delete":
        console.log("삭제 클릭");
        break;
    }
  };
  return (
    <div
      style={{
        width: "220px",
        display: "flex",
        flexDirection: "column",
        marginLeft: "38px",
      }}
    >
      {groups.map((group, groupIndex) => {
        const isLastGroup = groupIndex === groups.length - 1;

        return (
          <div key={group.id} style={{ position: "relative" }}>
            {/* Continuous vertical line through the entire section */}
            <div
              style={{
                position: "absolute",
                left: "3px", // Position at bullet center
                transform: "translateX(-50%)", // Center the line exactly
                top: "14px", // Start from the bullet center (8px padding + 6px bullet height / 2)
                height: isLastGroup
                  ? `${8 + group.items.length * 38}px` // End after last item in group
                  : `calc(100% - 32px)`, // Extend to next group
                width: "1px",
                backgroundColor: "#e5e5e5",
                zIndex: 1,
              }}
            />

            {/* Date Label with bullet */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingTop: "8px",
                paddingBottom: "8px",
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* Bullet for date label */}
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#D5D8DC",
                  marginRight: "10px",
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 3,
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "#989ba2",
                  fontWeight: 400,
                  paddingLeft: "8px",
                }}
              >
                {group.dateLabel}
              </span>
            </div>

            {/* Items in group */}
            {group.items.map((item) => {
              return (
                <div key={item.id} style={{ position: "relative" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      minHeight: "36px",
                      cursor: "pointer",
                      position: "relative",
                      padding: "4px 0px 4px 12px",
                      borderRadius: "8px",
                      transition: "background-color 0.2s ease",
                      marginLeft: "-6px",
                      marginRight: "-8px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                      const button = e.currentTarget.querySelector("button");
                      if (button) {
                        (button as HTMLElement).style.opacity = "1";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      const button = e.currentTarget.querySelector("button");
                      if (button && !contextMenu.isOpen) {
                        (button as HTMLElement).style.opacity = "0";
                      }
                    }}
                  >
                    {/* Space for the line */}
                    <div
                      style={{
                        width: "8px",
                        height: "36px",
                        marginRight: "10px",
                        flexShrink: 0,
                      }}
                    />

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0, paddingTop: "8px" }}>
                      <div
                        style={{
                          color: "#252525",
                          fontSize: "14px",
                          fontWeight: 400,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          lineHeight: "20px",
                          marginBottom: "4px",
                        }}
                      >
                        {item.title}
                      </div>
                      {item.description && (
                        <div
                          style={{
                            color: "#989ba2",
                            fontSize: "12px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.description}
                        </div>
                      )}
                    </div>

                    {/* More options button */}
                    <button
                      style={{
                        padding: "2px",
                        flexShrink: 0,
                        opacity:
                          contextMenu.isOpen && contextMenu.itemId === item.id
                            ? 1
                            : 0,
                        transition: "opacity 0.2s ease",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        marginRight: "4px",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        backgroundColor:
                          contextMenu.isOpen && contextMenu.itemId === item.id
                            ? "#EDEDF1"
                            : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (
                          !(
                            contextMenu.isOpen && contextMenu.itemId === item.id
                          )
                        ) {
                          e.currentTarget.style.backgroundColor = "#EDEDF1";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (
                          !(
                            contextMenu.isOpen && contextMenu.itemId === item.id
                          )
                        ) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                      onClick={(e) => handleContextMenuClick(e, item.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="2"
                        height="10"
                        viewBox="0 0 2 10"
                        fill="none"
                      >
                        <path
                          d="M1 8C1.55228 8 2 8.44771 2 9C2 9.55229 1.55228 10 1 10C0.447715 10 0 9.55229 0 9C0 8.44771 0.447715 8 1 8ZM1 4C1.55228 4 2 4.44772 2 5C2 5.55228 1.55228 6 1 6C0.447715 6 0 5.55228 0 5C0 4.44772 0.447715 4 1 4ZM1 0C1.55228 0 2 0.447715 2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0Z"
                          fill="#252525"
                        />
                      </svg>{" "}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Context Menu */}
      <HistoryContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={closeContextMenu}
        onShare={() => handleMenuAction("share", contextMenu.itemId)}
        onPin={() => handleMenuAction("pin", contextMenu.itemId)}
        onFavorite={() => handleMenuAction("favorite", contextMenu.itemId)}
        onRename={() => handleMenuAction("rename", contextMenu.itemId)}
        onDelete={() => handleMenuAction("delete", contextMenu.itemId)}
      />
    </div>
  );
};

export default HistoryList;
