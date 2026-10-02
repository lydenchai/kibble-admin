"use client";

import React from "react";
import { FiAlertTriangle as FiAlertTriangleBase, FiX as FiXBase } from "react-icons/fi";
import { ConfirmModalProps } from "@/types/components";
import Button from "@/components/ui/Button";

const FiAlertTriangle = FiAlertTriangleBase as React.ElementType;
const FiX = FiXBase as React.ElementType;

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  is_loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 transition-opacity animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-6 z-10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={is_loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
        >
          <FiX className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          {/* Icon Badge */}
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
              variant === "danger"
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : variant === "warning"
                ? "bg-amber-50 text-amber-600 border-amber-200"
                : "bg-brand-50 text-brand-600 border-brand-200"
            }`}
          >
            <FiAlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1 pr-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-stone-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={is_loading}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={variant === "danger" ? "danger" : "primary"}
            size="sm"
            onClick={handleConfirm}
            isLoading={is_loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
