import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const ModelSelector = () => {
  const [selectedModel, setSelectedModel] = useState('Select Model');

  const models = {
    'OpenAI': ['GPT-3.5', 'GPT-4.0'],
    'Gemini': ['Gemini 1.5', 'Gemini Ultra']
  };

  const handleModelSelect = (provider, model) => {
    setSelectedModel(`${provider} - ${model}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <span className="truncate">{selectedModel}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {Object.entries(models).map(([provider, providerModels], index) => (
          <React.Fragment key={provider}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex justify-between">
                {provider}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {providerModels.map((model) => (
                  <DropdownMenuItem
                    key={model}
                    onClick={() => handleModelSelect(provider, model)}
                  >
                    {model}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModelSelector;