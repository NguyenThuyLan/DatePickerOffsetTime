using System.Globalization;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;

namespace DatePickerOffsetTime
{
    public class DatePickerOffsetValueConverter : IPropertyValueConverter
    {
        public object? ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object? inter, bool preview)
        {
            return inter as DateTimeOffset?;
        }

        public object? ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object? source, bool preview)
        {
            if (parseDateTimeOffset(source, out DateTimeOffset parsedDateTime))
            {
                return parsedDateTime;
            }
            return DateTimeOffset.MinValue;
        }

        private bool parseDateTimeOffset(object? source, out DateTimeOffset parsedDateTime)
        {
            string? valueFromDatabase = (source as string)?.Split('(')?.FirstOrDefault()?.Trim();

            if (string.IsNullOrWhiteSpace(valueFromDatabase))
            {
                parsedDateTime = DateTimeOffset.MinValue;
                return false;
            }
            string format = "ddd MMM dd yyyy HH:mm:ss 'GMT'zzz";
            return DateTimeOffset.TryParseExact(valueFromDatabase, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out parsedDateTime);
        }

        public PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
        {
            return PropertyCacheLevel.None;
        }

        public Type GetPropertyValueType(IPublishedPropertyType propertyType)
        {
            return typeof(DateTimeOffset);
        }

        public bool IsConverter(IPublishedPropertyType propertyType)
        {
            return propertyType.EditorUiAlias.Equals("Umb.PropertyEditorUi.DatePickerOffset");
        }
        public bool? IsValue(object? value, PropertyValueLevel level)
        {
            return parseDateTimeOffset(value, out _);
        }
    }
}
