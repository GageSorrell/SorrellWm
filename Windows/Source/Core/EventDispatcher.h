#pragma once

#include <functional>
#include <unordered_map>

#include <iostream>

template<typename EventType>
class FEventDispatcher
{
public:
    FEventDispatcher() : NextId(0) { }

    virtual ~FEventDispatcher() { };

    virtual size_t Subscribe(std::function<void(EventType)> Callback)
    {
        const size_t Id = NextId++;
        Listeners.emplace(Id, Callback);
        return Id;
    }

    virtual void Unsubscribe(size_t Id)
    {
        // @TODO
    }
protected:
    virtual void Dispatch(EventType Event)
    {
        for (auto& [ Id, Callback ] : Listeners)
        {
            Callback(Event);
        }
    }

    size_t NextId;
    std::unordered_map<size_t, std::function<void(EventType)>> Listeners;
};
