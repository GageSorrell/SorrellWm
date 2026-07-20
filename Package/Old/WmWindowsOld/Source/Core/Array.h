/* File:      Array.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "CoreBase.h"
#include <cstddef>

template <typename ElementType>
class TArray
{
private:
    std::vector<ElementType> Vector;
public:
    TArray<ElementType>(const std::vector<ElementType>& In) : Vector(In) { }

    TArray(std::initializer_list<ElementType> InitialValues) : Vector(InitialValues) { }

    TArray(uint NumElementsReserved)
    {
        Vector.reserve(NumElementsReserved);
    }

    using FIterator = typename std::vector<ElementType>::iterator;
    using FConstIterator = typename std::vector<ElementType>::const_iterator;

    FIterator begin()
    {
        return Vector.begin();
    }

    FIterator end()
    {
        return Vector.end();
    }

    FConstIterator begin() const
    {
        return Vector.begin();
    }

    FConstIterator end() const
    {
        return Vector.end();
    }

    FConstIterator cbegin() const
    {
        return Vector.cbegin();
    }

    FConstIterator cend() const
    {
        return Vector.cend();
    }

    ElementType* At(std::ptrdiff_t Index) const
    {
        const std::ptrdiff_t Size = static_cast<std::ptrdiff_t>(Vector.size());

        const std::ptrdiff_t EffectiveIndex =
            (Index >= 0)
                ? Index
                : Size + Index;

        if (EffectiveIndex < 0 || EffectiveIndex >= Size)
        {
            return nullptr;
        }

        return &Vector[static_cast<std::size_t>(EffectiveIndex)];
    }

    const ElementType* At(std::ptrdiff_t Index) const
    {
        const std::ptrdiff_t Size = static_cast<std::ptrdiff_t>(Vector.size());

        const std::ptrdiff_t EffectiveIndex =
            (Index >= 0)
                ? Index
                : Size + Index;

        if (EffectiveIndex < 0 || EffectiveIndex >= Size)
        {
            return nullptr;
        }

        return &Vector[static_cast<std::size_t>(EffectiveIndex)];
    }

    template <typename ReturnType>
    using FTransformer = std::function<ReturnType (const ElementType&)>;

    template <typename ReturnType>
    using FTransformerIndexed = std::function<ReturnType (const ElementType&, int)>;

    template <typename ReturnType>
    using TTransformerAdvanced = std::function<ReturnType (const ElementType&, int, const TArray<ElementType>&)>;

    template <typename ReturnElementType>
    TArray<ReturnElementType> Map(const FTransformer<ReturnElementType>& Transformer)
    {
        TArray<ReturnElementType> Out;

        for (uint Index = 0; Index < Length(); Index++)
        {
            ElementType& Element = At(Index);
            Out.Push(Transformer(Element));
        }

        return Out;
    }

    template <typename ReturnElementType>
    TArray<ReturnElementType> Map(const FTransformerIndexed<ReturnElementType>& Transformer)
    {
        TArray<ReturnElementType> Out;
        for (uint Index = 0; Index < Length(); Index++)
        {
            ElementType& Element = At(Index);
            Out.Push(Transformer(Element, Index));
        }

        return Out;
    }

    template <typename ReturnElementType>
    TArray<ReturnElementType> Map(const TTransformerAdvanced<ReturnElementType>& Transformer)
    {
        TArray<ReturnElementType> Out;

        for (uint Index = 0; Index < Length(); Index++)
        {
            ElementType& Element = At(Index);
            Out.Push(Transformer(Element, Index, this));
        }

        return Out;
    }

    using FSideEffect = std::function<void (const ElementType&)>;
    using FSideEffectIndexed = std::function<void (const ElementType&, int)>;
    using FSideEffectAdvanced = std::function<void (const ElementType&, int, const TArray<ElementType>&)>;

    void ForEach(const FSideEffect& SideEffect)
    {
        for (uint Index = 0; Index < Length(); Index++)
        {
            ElementType& Element = At(Index);
            SideEffect(Element);
        }
    }

    void ForEach(const FSideEffectIndexed& SideEffect)
    {
        for (uint Index = 0; Index < Length(); Index++)
        {
            ElementType& Element = At(Index);
            SideEffect(Element, Index);
        }
    }

    void ForEach(const FSideEffectAdvanced& SideEffect)
    {
        for (uint Index = 0; Index < Length(); Index++)
        {
            ElementType& Element = At(Index);
            SideEffect(Element, Index, this);
        }
    }

    ElementType operator[](uint Index) const
    {
        return Vector[Index];
    }

    ElementType& operator[](uint Index)
    {
        return Vector[Index];
    }

    uint Length() const
    {
        return Vector.size();
    }

    template <typename... ArgumentVectorType>
        requires ((std::same_as<std::remove_cvref_t<ArgumentVectorType>, ElementType>) && ...)
    void Push(ArgumentVectorType&&... Elements)
    {
        (Vector.push_back(std::forward<ArgumentVectorType>(Elements)), ...);

    }

    void Reverse()
    {
        std::reverse(Vector.begin(), Vector.end());
    }

    TArray<ElementType> GetReversed() const
    {
        return TArray<ElementType>(Vector.rbegin(), Vector.rend());
    }

    void Reserve(uint NumElementsReserved)
    {
        Vector.reserve(NumElementsReserved);
    }

    std::vector<ElementType> GetVector() const
    {
        return Vector;
    }

    TArray<ElementType> Concat(const TArray<ElementType>& Other) const
    {
        TArray<ElementType> Out(Vector);

        ForEach([](const ElementType& Element) -> void
        {
            Out.Push(Element);
        });

        return Out;
    }

    TArray<ElementType> GetEntries() const
    {
        return Map([&](const ElementType& Element, int Index) -> TPair<int, ElementType>
        {
            return TPair<int, ElementType>(Index, Element);
        });
    }
};
