export default function Input({
    placeholder,
    value,
    onChange,
    onKeyPress,
    disabled = false,
    className = '',
    multiline = false,
    rows = 3
}) {
    const baseStyles = 'w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed';

    if (multiline) {
        return (
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                rows={rows}
                className={`${baseStyles} resize-none ${className}`}
            />
        );
    }

    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            disabled={disabled}
            className={`${baseStyles} ${className}`}
        />
    );
}
