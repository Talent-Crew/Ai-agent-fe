export default function Card({ children, className = '', padding = 'md' }) {
    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div className={`bg-white rounded-lg shadow-md border border-slate-200 ${paddings[padding]} ${className}`}>
            {children}
        </div>
    );
}
