# DatePicker with Offset time

**DatePicker with Offset time** is a property editor that shows the time to editors relative to their respective time zone rather than the server time like what the default Umbraco date time picker does.

No configuration is required for the package. Once installed, simply log into the BackOffice, and you will find a new property editor **DatePicker with Offset time**.

[![Screenshot 1](https://raw.githubusercontent.com/NguyenThuyLan/DatePickerOffsetTime/refs/heads/main/images/DatepickerOffsetTime.png)](https://raw.githubusercontent.com/NguyenThuyLan/DatePickerOffsetTime/refs/heads/main/images/DatepickerOffsetTime.png)

Create new content has DatePicker with Offset time property, select date and save, it will show the time to editors relative to their respective time zone.

Below is the editor's time in the Danish time zone:

[![Screenshot 2](https://raw.githubusercontent.com/NguyenThuyLan/DatePickerOffsetTime/refs/heads/main/images/denmarkzone.png)](https://raw.githubusercontent.com/NguyenThuyLan/DatePickerOffsetTime/refs/heads/main/images/denmarkzone.png)

And when viewed by an editor in the Vietnam time zone:

[![Screenshot 3](https://raw.githubusercontent.com/NguyenThuyLan/DatePickerOffsetTime/refs/heads/main/images/vietnamzone.png)](https://raw.githubusercontent.com/NguyenThuyLan/DatePickerOffsetTime/refs/heads/main/images/vietnamzone.png)

## Requirements

Currently, this package is only compatible with Umbraco 14. 

## Installation

### Visual Studio

Simply search for the `DatePickerOffsetTime` NuGet package and add it to your project.

### CLI

`dotnet add package DatePickerOffsetTime`