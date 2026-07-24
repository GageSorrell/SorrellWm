/**
 *
 *
 * @module @sorrell/log/native/include/sorrell/log_record
 *
 * @file      log_record.hpp
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#pragma once

#include <cstddef>
#include <cstdint>
#include <optional>
#include <string>
#include <utility>
#include <variant>
#include <vector>

namespace Sorrell::Log
{
    enum class Level
    {
        Fatal,
        Error,
        Warn,
        Info,
        Debug,
        Trace
    };

    using FieldValue = std::variant<
        std::nullptr_t,
        bool,
        std::int64_t,
        std::uint64_t,
        double,
        std::string
    >;

    struct Field
    {
        std::string Name;
        FieldValue Value;

        template<typename ValueType>
        Field(std::string FieldName, ValueType&& FieldData)
            : Name(std::move(FieldName)),
              Value(std::forward<ValueType>(FieldData))
        {
        }
    };

    struct Record
    {
        Level Severity = Level::Info;
        std::string Category;
        std::string Message;
        std::vector<Field> Fields;
        std::optional<std::string> ThreadIdentifier;
    };
}
