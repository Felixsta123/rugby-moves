import React from "react";

interface ExportControlsProps {
    onExportGif: () => void;
    isExporting: boolean;
}

const ExportControls: React.FC<ExportControlsProps> = ({
    onExportGif,
    isExporting,
}) => {
    return (
        <div className='p-4 bg-gray-100 rounded-lg'>
            <button
                onClick={onExportGif}
                disabled={isExporting}
                className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50'
            >
                {isExporting ? "Exporting..." : "Export as GIF"}
            </button>
        </div>
    );
};

export default ExportControls;
