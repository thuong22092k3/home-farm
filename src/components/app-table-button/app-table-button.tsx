"use client";

import { Eye, PencilLine, Trash2, type LucideIcon } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { AppIconButton } from "@/components/app-icon-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AppButton } from "../app-button";

export type CustomAction = {
  key: string;
  icon: LucideIcon | React.ReactNode;
  onClick: () => void;
  tooltip?: string;
  color?: string;
  variant?: "ghost" | "outline" | "default";
  disabled?: boolean;
};

type Props = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isConfirmDelete?: boolean;
  customActions?: CustomAction[];
  disabledView?: boolean;
  disabledEdit?: boolean;
  disabledDelete?: boolean;
  disabledTooltipMessage?: string;
  viewTooltip?: string;
  editTooltip?: string;
  deleteTooltip?: string;
  deleteConfirmationTitle?: string;
  deleteConfirmationDescription?: string;
  deleteConfirmationConfirmLabel?: string;
};

type ActionButtonProps = {
  onClick?: () => void;
  icon: LucideIcon | React.ReactNode;
  variant?: "ghost" | "outline" | "default";
  className?: string;
  tooltip?: string;
  disabled?: boolean;
};

export function ActionButton({
  onClick,
  icon,
  variant = "ghost",
  className,
  tooltip,
  disabled,
}: ActionButtonProps) {
  let iconNode: React.ReactNode;

  if (React.isValidElement(icon)) {
    iconNode = icon;
  } else {
    const Icon = icon as LucideIcon;
    iconNode = <Icon size={16} />;
  }

  const btn = (
    <AppIconButton
      variant={variant}
      disabled={disabled}
      icon={iconNode}
      tooltip={tooltip}
      className={cn(
        "h-8 w-8 rounded-md transition-all items-center! justify-center! flex!",
        disabled
          ? "cursor-not-allowed text-muted-foreground/40 bg-transparent opacity-50"
          : "cursor-pointer",
        className,
      )}
      onClick={(e: React.MouseEvent) => {
        e?.stopPropagation();
        if (disabled) return;
        onClick?.();
      }}
    />
  );

  if (!tooltip) return btn;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              "w-fit",
              disabled ? "cursor-not-allowed" : "cursor-pointer",
            )}
          >
            {btn}
          </div>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

export function AppTableButton({
  onView,
  onEdit,
  onDelete,
  isConfirmDelete = true,
  customActions,
  disabledView = false,
  disabledEdit = false,
  disabledDelete = false,
  disabledTooltipMessage,
  viewTooltip,
  editTooltip,
  deleteTooltip,
  deleteConfirmationTitle,
  deleteConfirmationDescription,
  deleteConfirmationConfirmLabel,
}: Props) {
  const { t: tCommon } = useTranslation("common");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <div className="flex flex-row items-center justify-center gap-1">
      {/* VIEW */}
      {onView && (
        <ActionButton
          onClick={onView}
          icon={<Eye size={12} />}
          className={cn(
            !disabledView &&
              "text-muted-foreground/50 hover:text-primary hover:bg-primary/10",
          )}
          disabled={disabledView}
          tooltip={disabledView ? disabledTooltipMessage : viewTooltip}
        />
      )}

      {/* EDIT */}
      {onEdit && (
        <ActionButton
          onClick={onEdit}
          icon={<PencilLine size={12} />}
          className={cn(
            !disabledEdit &&
              "text-primary/50 hover:text-primary hover:bg-primary/10",
          )}
          disabled={disabledEdit}
          tooltip={disabledEdit ? disabledTooltipMessage : editTooltip}
        />
      )}

      {/* CUSTOM ACTIONS */}
      {customActions?.map((action) => (
        <ActionButton
          key={action.key}
          onClick={action.onClick}
          icon={action.icon}
          variant={action.variant}
          tooltip={action.tooltip}
          disabled={action.disabled}
          className={cn(
            !action.disabled
              ? "hover:bg-muted"
              : "text-muted-foreground/40 bg-transparent",
            action.color,
          )}
        />
      ))}

      {/* DELETE */}
      {onDelete &&
        (isConfirmDelete ? (
          <Popover
            open={isPopoverOpen && !disabledDelete}
            onOpenChange={setIsPopoverOpen}
          >
            <PopoverTrigger>
              <div
                className={cn(
                  disabledDelete
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer",
                )}
                onClick={(e) => !disabledDelete && e.stopPropagation()}
              >
                <AppIconButton
                  variant="ghost"
                  icon={<Trash2 size={12} />}
                  disabled={disabledDelete}
                  className={cn(
                    "h-8 w-8 transition-all",
                    disabledDelete
                      ? "cursor-not-allowed text-muted-foreground/40 bg-transparent"
                      : "text-destructive/50 hover:text-destructive/70 hover:bg-destructive/10",
                  )}
                />
              </div>
            </PopoverTrigger>

            <PopoverContent
              className="w-60 p-3 shadow-xl border-border mx-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="font-bold text-sm text-foreground">
                    {deleteConfirmationTitle ?? tCommon("message.delete.title")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {deleteConfirmationDescription ??
                      tCommon("message.delete.content")}
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <AppButton
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setIsPopoverOpen(false)}
                  >
                    {tCommon("action.cancel")}
                  </AppButton>

                  <AppButton
                    variant="destructive"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      onDelete();
                      setIsPopoverOpen(false);
                    }}
                  >
                    {deleteConfirmationConfirmLabel ??
                      tCommon("action.confirm")}
                  </AppButton>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <ActionButton
            onClick={onDelete}
            icon={Trash2}
            disabled={disabledDelete}
            className={cn(
              !disabledDelete && "text-destructive hover:bg-destructive/10",
            )}
            tooltip={disabledDelete ? disabledTooltipMessage : deleteTooltip}
          />
        ))}
    </div>
  );
}
