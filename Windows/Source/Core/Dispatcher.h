#pragma once

#include <map>
#include <functional>
#include <mutex>
#include <atomic>

template<typename PayloadType>
class TDispatcher
{
public:
    using TaskId = uint64_t;

    TaskId Register(const std::function<void(PayloadType)>& task)
    {
        std::lock_guard<std::mutex> lock(mutex_);
        TaskId id = nextId_++;
        tasks_[id] = task;
        return id;
    }

    void Dispatch(PayloadType Payload)
    {
        std::lock_guard<std::mutex> lock(mutex_);
        for (auto& [id, task] : tasks_)
        {
            if (task)
            {
                task(Payload);
            }
        }
    }

    void Unregister(TaskId id)
    {
        std::lock_guard<std::mutex> lock(mutex_);
        tasks_.erase(id);
    }

private:
    std::map<TaskId, std::function<void(PayloadType)>> tasks_;
    std::mutex mutex_;
    std::atomic<TaskId> nextId_{1};
};
