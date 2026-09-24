import React from 'react';
import type { Account, AITool } from '../data/mappers';
import { ResetBar } from './ResetBar';
import { formatResetTime } from '../utils/timeParser';

interface AccountCardProps {
  account: Account;
  tool: AITool;
  currentTime: number;
  onOpenManageModal: (account: Account, tool: AITool) => void;
  canEdit: boolean;
}

export const AccountCard = React.memo(function AccountCard({
  account,
  tool,
  currentTime,
  onOpenManageModal,
  canEdit,
}: AccountCardProps) {
  const isRunOut = account.status === 'run-out';

  return (
    <div className={`account-card ${account.isDisabled ? 'disabled' : ''} ${isRunOut ? 'run-out' : ''}`}>
      <div className="account-header">
        <div className="account-title-group">
          <span className="account-email">{account.email}</span>
          {account.isDisabled && <span className="badge badge-secondary">Disabled</span>}
          {isRunOut ? (
            <span className="badge badge-danger">Exhausted</span>
          ) : (
            <span className="badge badge-success">Active</span>
          )}
        </div>
        {canEdit && (
          <button
            className="btn btn-small"
            onClick={() => onOpenManageModal(account, tool)}
          >
            Manage
          </button>
        )}
      </div>

      <div className="account-body">
        {!isRunOut && (
          <ResetBar
            targetTime={account.resetTime}
            currentTime={currentTime}
            resetCycleHours={tool.resetCycleHours}
          />
        )}

        {account.nextDueDate && (
          <div className="account-meta">
            <span>Reset / Renewal Due: {formatResetTime(account.nextDueDate)}</span>
          </div>
        )}

        {account.note && (
          <div className="account-note">
            <small>{account.note}</small>
          </div>
        )}
      </div>
    </div>
  );
});
