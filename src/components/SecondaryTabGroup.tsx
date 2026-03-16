import React from 'react';

interface SecondaryTab {
  id: string;
  label: string;
}

interface SecondaryTabGroupProps {
  tabs: SecondaryTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

const SecondaryTabGroup: React.FC<SecondaryTabGroupProps> = ({
  tabs,
  activeTabId,
  onTabChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {tabs.map((tab, index) => (
        <React.Fragment key={tab.id}>
          <div
            style={{
              height: '24px',
              width: '104px',
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={() => onTabChange(tab.id)}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'One UI Sans GUI', sans-serif",
                justifyContent: 'center',
                lineHeight: 0,
                fontStyle: 'normal',
                color: activeTabId === tab.id ? '#0106ff' : '#989ba2',
                fontSize: '18px',
                textAlign: 'center',
                fontWeight: activeTabId === tab.id ? 600 : 400,
                transition: 'all 0.2s ease',
              }}
            >
              <p style={{ lineHeight: '24px', margin: 0 }}>{tab.label}</p>
            </div>
          </div>

          {/* Vertical divider line */}
          {index < tabs.length - 1 && (
            <div
              style={{
                height: '16px',
                width: '1px',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  backgroundColor: '#d5d8dc',
                  inset: 0,
                }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SecondaryTabGroup;