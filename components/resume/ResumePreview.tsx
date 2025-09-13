import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { TEMPLATES } from '../../constants';

const ResumePreview = React.forwardRef<HTMLDivElement>((_, ref) => {
    const { state } = useResume();
    const { data, templateId } = state;

    const SelectedTemplate = TEMPLATES.find(t => t.id === templateId)?.component;

    return (
        <div className="bg-gray-100 p-4 sm:p-6 rounded-2xl shadow-neumorphic">
            <div 
                ref={ref} 
                className="aspect-[8.5/11] w-full bg-white shadow-lg overflow-y-auto" 
                style={{ maxHeight: 'calc(100vh - 10rem)' }}
            >
                {SelectedTemplate ? <SelectedTemplate data={data} /> : <div>Template not found.</div>}
            </div>
        </div>
    );
});

export default ResumePreview;