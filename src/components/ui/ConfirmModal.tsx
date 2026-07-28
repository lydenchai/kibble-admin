"use client";

import React from "react";
import { FiAlertTriangle as FiAlertTriangleBase, FiX as FiXBase } from "react-icons/fi";
import { ConfirmModalProps } from "@/types/components";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200/80 p-6 z-10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={is_loading}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-50"
        >
          <FiX className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          {/* Icon Badge */}
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              variant === "danger"
                ? "bg-rose-100 text-rose-600"
                : variant === "warning"
                ? "bg-amber-100 text-amber-600"
                : "bg-brand-100 text-brand-600"
            }`}
          >
            <FiAlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1 pr-4">
            <h3 className="text-base font-extrabold text-stone-900 tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            disabled={is_loading}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={is_loading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
              variant === "danger"
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                : variant === "warning"
                ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                : "bg-brand-600 hover:bg-brand-700 shadow-brand-600/20"
            }`}
          >
            {is_loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
