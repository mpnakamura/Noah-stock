"use client";

import { Template } from "@/types/mindmap";
import { pmTemplates } from "@/lib/pm-templates";
import { BookTemplate } from "lucide-react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <BookTemplate className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          PMテンプレート
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        実践的なPM業務のテンプレートから始められます
      </p>

      <div className="grid grid-cols-1 gap-3">
        {pmTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="flex flex-col items-start p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-lg border border-blue-200 dark:border-gray-600 transition-all duration-200 hover:shadow-md"
          >
            <div className="text-3xl mb-2">{template.icon}</div>
            <div className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
              {template.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 text-left">
              {template.description}
            </div>
            <div className="mt-2">
              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                {template.category}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
